const express = require('express');
const router = express.Router();

const { Spot, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

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
    const Spots = await Spot.findAll();

    return res.json({
      Spots
    })
  }
);

// Get all spots owned by Current User
router.get(
  '/current',
  async (req, res) => {
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

    if (theSpot) {
      const owner = await User.findByPk(theSpot.ownerId);

      const ownerDetails = {
        id: theSpot.ownerId,
        firstName: owner.firstName,
        lastName: owner.lastName
      }

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
        numReviews: 'UPDATE ME',
        avgStarRating: 'UPDATE ME',
        SpotImages: [
          {
            id: null,
            url: null,
            preview: false
          }
        ],
        Owner: ownerDetails
      }
      return res.json({
        ...details
      })
    }
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
);

// Edit a spot
router.put(
  '/:spotId',
  validateSpot,
  async (req, res) => {
    const theSpot = await Spot.findByPk(req.params.spotId);
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const currUserId = req.user.id;

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
    }
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
);

// Delete a spot
router.delete(
  '/:spotId',
  async (req, res) => {
    const currUserId = req.user.id;
    const theSpot = await Spot.findByPk(req.params.spotId);

    if (theSpot && currUserId === theSpot.ownerId) {
      await theSpot.destroy();

      return res.json({
        message: 'Successfully deleted'
      })
    };

    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
);




module.exports = router;
