const express = require('express');

const { Spot } = require('../../db/models');

const router = express.Router();


// Create a spot
router.post(
  '',
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

module.exports = router;
