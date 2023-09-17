const express = require('express');
const router = express.Router();

const { Spot, Image, Review } = require('../../db/models');


// Delete a Review Image
router.delete(
  '/:imageId',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;

    const theImage = await Image.findOne({
      where: {
        id: req.params.imageId,
        imageableType: 'review'
      }
    });

    if (!theImage) {
      return res.status(404).json({
        message: "Review Image couldn't be found"
      })
    };

    const theReview = await Review.findByPk(theImage.imageableId);

    if (theReview.userId !== currUserId) {
      return res.status(403).json({
        message: "Review must belong to the current user"
      })
    };

    await theImage.destroy();

    return res.json({
      message: "Successfully deleted"
    });
  }
);



module.exports = router;
