const express = require('express');
const router = express.Router();

const { Spot, Image } = require('../../db/models');


// Delete a Spot Image
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
        imageableType: 'spot'
      }
    });

    if (!theImage) {
      return res.status(404).json({
        message: "Spot Image couldn't be found"
      })
    };

    const theSpot = await Spot.findByPk(theImage.imageableId);

    if (theSpot.ownerId !== currUserId) {
      return res.status(403).json({
        message: "Spot must belong to the current user"
      })
    };

    await theImage.destroy();

    return res.json({
      message: "Successfully deleted"
    });
  }
);



module.exports = router;
