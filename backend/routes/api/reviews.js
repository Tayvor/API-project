const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review, Image } = require('../../db/models');

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .custom(value => {
      if (value) {
        return value >= 1 && value <= 5;
      }
    })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];


// Get all Reviews of the Current User
router.get(
  '/current',
  async (req, res) => {
    const currUserId = req.user.id;

    const currUserReviews = await Review.findAll({
      where: { userId: currUserId }
    });

    if (!currUserReviews) {
      return res.status(404).json({
        message: "Current user hasn't submitted a review"
      })
    };

    const userDetails = await User.findByPk(currUserId);

    const userObj = {
      id: userDetails.id,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName
    };

    const Reviews = [];

    for (const review of currUserReviews) {
      const spotDetails = await Spot.findByPk(review.spotId);

      const spotObj = {
        id: spotDetails.id,
        ownerId: spotDetails.ownerId,
        address: spotDetails.address,
        city: spotDetails.city,
        state: spotDetails.state,
        country: spotDetails.country,
        lat: spotDetails.lat,
        lng: spotDetails.lng,
        name: spotDetails.name,
        price: spotDetails.price,
        previewImage: "I NEED FIXED!!"
      };

      const safeReview = {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.content,
        stars: review.starRating,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: { ...userObj },
        Spot: { ...spotObj },
        ReviewImages: [
          {
            id: 'fix me',
            url: 'fix me too please'
          }
        ]
      };

      Reviews.push(safeReview);
    };

    return res.json({
      Reviews
    })
  }
);

// Get all Reviews by a Spot's id
router.get(
  '/:spotId/reviews',
  async (req, res) => {
    const theSpot = await Spot.findByPk(req.params.spotId);

    if (!theSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    }
    const spotReviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      }
    });

    const reviewData = [];

    for (const review of spotReviews) {
      const reviewAuthor = await User.findByPk(review.userId);
      const userDetails = {
        id: reviewAuthor.id,
        firstName: reviewAuthor.firstName,
        lastName: reviewAuthor.lastName
      }

      const formattedReview = {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.content,
        stars: review.starRating,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: { ...userDetails },
        ReviewImages: [
          {
            id: 'fix me',
            url: 'fix me'
          }
        ]
      }

      reviewData.push(formattedReview)
    }

    return res.json({
      Reviews: reviewData
    })
  }
);

// Create a Review for a Spot based on the Spot's id
router.post(
  '/:spotId/reviews',
  validateReview,

  async (req, res) => {
    const theSpotId = Number(req.params.spotId);
    const currUserId = req.user.id;

    const spotReviewsByCurrUser = await Review.findAll({
      where: {
        userId: currUserId,
        spotId: theSpotId
      }
    });

    if (spotReviewsByCurrUser.length) {
      return res.status(500).json({
        message: "User already has a review for this spot"
      });
    } else {
      const theSpot = await Spot.findByPk(theSpotId);

      if (!theSpot) {
        return res.status(404).json({
          message: "Spot couldn't be found"
        })
      };

      const { review, stars } = req.body;
      const userId = currUserId;
      const spotId = theSpotId;
      const content = review;
      const starRating = stars;

      const newReview = await Review.create({ userId, spotId, content, starRating });

      const safeReview = {
        id: newReview.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.content,
        stars: newReview.starRating,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
      };

      res.status(201).json({
        ...safeReview
      })
    };
  }
);

// Add an Image to a Review based on the Review's id
router.post(
  '/:reviewId/images',
  async (req, res) => {
    const theReview = await Review.findByPk(req.params.reviewId);
    const currUserId = req.user.id;

    if (!theReview) {
      return res.status(404).json({
        message: "Review couldn't be found"
      })
    };

    if (theReview.userId !== currUserId) {
      return res.status(403).json({
        message: "Spot must belong to the current user"
      })
    };

    const theReviewImages = await Image.findAll({
      where: {
        imageableId: theReview.id,
        imageableType: 'review'
      }
    });

    if (theReviewImages.length === 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached"
      })
    };

    const { url } = req.body;
    const imageableId = theReview.id;
    const imageableType = 'review';
    const preview = false;

    const newImage = await Image.create({ url, imageableId, imageableType, preview });

    const reviewImageInfo = {
      id: newImage.id,
      url: newImage.url
    }

    return res.json({
      ...reviewImageInfo
    });
  }
);

// Edit a Review
router.put(
  '/:reviewId',
  validateReview,
  async (req, res) => {
    const theReview = await Review.findByPk(req.params.reviewId);

    if (!theReview) {
      return res.status(404).json({
        message: "Review couldn't be found"
      })
    };

    const { review, stars } = req.body;

    theReview.set({
      content: review,
      starRating: stars
    });

    await theReview.save();

    const updatedReview = {
      id: theReview.id,
      userId: theReview.userId,
      spotId: theReview.spotId,
      review: theReview.content,
      stars: theReview.starRating,
      createdAt: theReview.createdAt,
      updatedAt: theReview.updatedAt
    };

    return res.json(updatedReview);
  }
);

// Delete a Review
router.delete(
  '/:reviewId',
  async (req, res) => {
    const theReview = await Review.findByPk(req.params.reviewId);
    const currUserId = req.user.id;

    if (!theReview) {
      return res.status(404).json({
        message: "Review couldn't be found"
      })
    };

    if (theReview.userId === currUserId) {
      await theReview.destroy();

      return res.json({
        message: 'Successfully deleted'
      })
    }
  }
);




module.exports = router;
