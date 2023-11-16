const express = require('express');
const router = express.Router();

const { Spot, User, SpotImage, Review } = require('../../db/models');
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const spot = require('../../db/models/spot');

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .custom(value => {
      if (value) {
        return value >= -90 && value <= 90;
      }
    })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .custom(value => {
      if (value) {
        return value >= -180 && value <= 180;
      }
    })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .custom(value => {
      return value.length < 50;
    })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];


// Create a spot
router.post(
  '',
  validateSpot,
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const ownerId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      })
    };

    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    const safeSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    };

    return res.status(201).json({
      ...safeSpot
    });
  }
);

// Get all spots
router.get(
  '',
  async (req, res) => {
    let { page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
    let invalid = false;

    const pageSize = {
      offset: 0,
      limit: 20,
    };

    const errors = {};
    // const filters = {};
    const where = {};

    if (minLat || maxLat || minLng || maxLng || minPrice || maxPrice) {
      if (minLat) {
        minLat = Number(minLat);
        if (minLat < -90 || minLat > 90) {
          errors.minLat = "Minimum latitude is invalid"
          invalid = true;
        };
        where.lat = { [Op.gte]: minLat };
      };

      if (maxLat) {
        maxLat = Number(maxLat);
        if (maxLat < -90 || maxLat > 90) {
          errors.maxLat = "Maximum latitude is invalid"
          invalid = true;
        };
        if (minLat && maxLat) {
          where.lat = { [Op.gte]: minLat, [Op.lte]: maxLat };
        } else {
          where.lat = { [Op.lte]: maxLat };
        };
      };

      if (minLng) {
        minLng = Number(minLng);
        if (minLng < -180 || minLng > 180) {
          errors.minLng = "Minimum longitude is invalid"
          invalid = true;
        };
        where.lng = { [Op.gte]: minLng };
      };

      if (maxLng) {
        maxLng = Number(maxLng);
        if (maxLng < -180 || maxLng > 180) {
          errors.maxLng = "Maximum longitude is invalid"
          invalid = true;
        };
        if (minLng && maxLng) {
          where.lng = { [Op.gte]: minLng, [Op.lte]: maxLng };
        } else {
          where.lng = { [Op.lte]: maxLng };
        };
      };

      if (minPrice) {
        minPrice = Number(minPrice);
        if (minPrice < 0) {
          errors.minPrice = "Minimum price must be greater than or equal to 0"
          invalid = true;
        };
        where.price = { [Op.gte]: minPrice };
      };

      if (maxPrice) {
        maxPrice = Number(maxPrice);
        if (maxPrice < 0) {
          errors.maxPrice = "Maximum price must be greater than or equal to 0"
          invalid = true;
        };
        if (minPrice && maxPrice) {
          where.price = { [Op.gte]: minPrice, [Op.lte]: maxPrice };
        } else {
          where.price = { [Op.lte]: maxPrice };
        };
      };
    };

    if (page) {
      page = Number(page);
      if (page > 10) {
        page = 10;
      };
      if (page < 1) {
        errors.page = "Page must be greater than or equal to 1",
          invalid = true;
      };
      if (page && size) {
        pageSize.offset = size * (page - 1);
      }
    } else {
      page = 1;
    };

    if (size) {
      size = Number(size);
      if (size > 20) {
        size = 20;
      };
      if (size < 1) {
        errors.size = "Size must be greater than or equal to 1",
          invalid = true;
      };
      pageSize.limit = size;
    } else {
      size = 20;
    };

    if (invalid) {
      invalid = false;

      return res.status(400).json({
        message: "Bad Request",
        errors
      })
    };

    const Spots = await Spot.findAll({
      ...pageSize,
      where
    });

    for (const spot of Spots) {
      let starSum = 0;
      let reviewCount = 0;

      const previewImage = await SpotImage.findOne({
        where: {
          spotId: spot.id,
          preview: true
        }
      });

      if (previewImage) {
        spot.set({
          previewImage: previewImage.url,
        })
      };

      const Reviews = await Review.findAll({
        where: {
          spotId: spot.id
        }
      });

      for (const review of Reviews) {
        // console.log(review, '<=== ***** ===')
        starSum += review.starRating;
        reviewCount++;
      };

      const avgStarRating = starSum / reviewCount;
      // console.log(avgStarRating.length, '<=== ***** ===')

      spot.set({
        avgRating: avgStarRating,
      });

      await spot.save();
    };

    return res.json({
      Spots,
      page,
      size
    })
  }
);

// Get all spots owned by Current User
router.get(
  '/current',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;

    const Spots = await Spot.findAll({ where: { ownerId: currUserId } });

    return res.json({ Spots });
  }
);

// Get details of a Spot from an id
router.get(
  '/:spotId',
  async (req, res) => {
    const spotId = req.params.spotId;
    const theSpot = await Spot.findByPk(spotId);

    if (!theSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    };

    if (theSpot) {
      const owner = await User.findByPk(theSpot.ownerId);

      const ownerDetails = {
        id: theSpot.ownerId,
        firstName: owner.firstName,
        lastName: owner.lastName
      };

      // const SpotImages = [];
      // const images = await SpotImage.findAll({
      //   where: {
      //     spotId: theSpot.id,
      //   }
      // });

      // for (const image of images) {
      //   const anImage = {
      //     id: image.id,
      //     url: image.url,
      //     preview: image.preview,
      //   };

      //   SpotImages.push(anImage);
      // };

      // let starSum = 0;
      // let reviewCount = 0;

      // const Reviews = await Review.findAll({
      //   where: {
      //     spotId: theSpot.id
      //   }
      // });

      // for (const review of Reviews) {
      //   starSum += review.starRating;
      //   reviewCount++;
      // };

      // const avgStarRating = starSum / reviewCount;

      // theSpot.set({
      //   avgRating: avgStarRating,
      // });

      await theSpot.save();

      const details = {
        id: theSpot.id,
        ownerId: theSpot.ownerId,
        address: theSpot.address,
        city: theSpot.city,
        state: theSpot.state,
        country: theSpot.country,
        lat: theSpot.lat,
        lng: theSpot.lng,
        name: theSpot.name,
        description: theSpot.description,
        price: theSpot.price,
        // numReviews: reviewCount,
        // avgStarRating: theSpot.avgRating,
        // SpotImages,
        Owner: ownerDetails
      }
      return res.json({
        ...details
      });
    };
  }
);

// Edit a spot
router.put(
  '/:spotId',
  validateSpot,
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const theSpot = await Spot.findByPk(req.params.spotId);

    if (!theSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    };

    if (currUserId !== theSpot.ownerId) {
      return res.status(403).json({
        message: "Forbidden"
      })
    };

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      })
    };

    if (theSpot && currUserId === theSpot.ownerId) {
      theSpot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
      });

      await theSpot.save();

      const spotDetails = {
        id: theSpot.id,
        ownerId: theSpot.ownerId,
        address: theSpot.address,
        city: theSpot.city,
        state: theSpot.state,
        country: theSpot.country,
        lat: theSpot.lat,
        lng: theSpot.lng,
        name: theSpot.name,
        description: theSpot.description,
        price: theSpot.price,
        createdAt: theSpot.createdAt,
        updatedAt: theSpot.updatedAt
      };

      return res.json({
        ...spotDetails
      })
    };
  }
);

// Delete a spot
router.delete(
  '/:spotId',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const theSpot = await Spot.findByPk(req.params.spotId);

    if (!theSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    };

    if (currUserId !== theSpot.ownerId) {
      return res.status(403).json({
        message: "Forbidden"
      })
    };

    if (theSpot && currUserId === theSpot.ownerId) {
      await theSpot.destroy();

      return res.json({
        message: 'Successfully deleted'
      })
    };
  }
);

// Add an Image to a Spot based on the Spot's id
router.post(
  '/:spotId/images',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const theSpot = await Spot.findByPk(req.params.spotId);
    let { url, preview } = req.body;

    if (!theSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    };

    if (theSpot.ownerId !== currUserId) {
      return res.status(403).json({
        message: "Forbidden"
      })
    };

    const spotPreviewImage = await Image.findOne({
      where: {
        imageableId: theSpot.id,
        imageableType: 'spot',
        preview: true
      }
    });

    if (!spotPreviewImage) {
      preview = true
    };

    if (spotPreviewImage && preview === true) {
      spotPreviewImage.set({
        preview: false
      });

      await spotPreviewImage.save()
    };

    const theSpotImages = await Image.findAll({
      where: {
        imageableId: theSpot.id,
        imageableType: 'spot'
      }
    });

    if (theSpotImages.length >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached"
      })
    };

    const imageableId = theSpot.id;
    const imageableType = 'spot';

    const newImage = await Image.create({ url, preview, imageableId, imageableType });
    const imageInfo = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    };

    return res.json({
      ...imageInfo
    })
  }
);



module.exports = router;
