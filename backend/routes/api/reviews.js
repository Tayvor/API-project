const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review } = require('../../db/models');

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

    // aliasing???
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
)

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



module.exports = router;
