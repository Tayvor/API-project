const express = require('express');
const router = express.Router();

const { Spot, User, Booking } = require('../../db/models');
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('validateBooking error message, regarding startDate'),
  handleValidationErrors
];

// Get all of the Current User's Bookings
router.get(
  '/current',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const currUserBookings = await Booking.findAll({
      where: {
        userId: currUserId
      }
    });

    const Bookings = [];

    for (const booking of currUserBookings) {
      const theSpot = await Spot.findByPk(booking.spotId);
      const bookingDetails = {};
      const aSpot = {};

      aSpot.id = theSpot.id;
      aSpot.ownerId = theSpot.ownerId;
      aSpot.address = theSpot.address;
      aSpot.city = theSpot.city;
      aSpot.state = theSpot.state;
      aSpot.country = theSpot.country;
      aSpot.lat = theSpot.lat;
      aSpot.lng = theSpot.lng;
      aSpot.name = theSpot.name;
      aSpot.price = theSpot.price;
      aSpot.previewImage = theSpot.previewImage;

      bookingDetails.id = booking.id;
      bookingDetails.spotId = booking.spotId;
      bookingDetails.Spot = aSpot;
      bookingDetails.userId = booking.userId;
      bookingDetails.startDate = booking.startDate;
      bookingDetails.endDate = booking.endDate;
      bookingDetails.createdAt = booking.createdAt;
      bookingDetails.updatedAt = booking.updatedAt;

      Bookings.push(bookingDetails);
    };

    return res.json({ Bookings });
  }
);

// Get all Bookings for a Spot based on the Spot's id
router.get(
  '/:spotId/bookings',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const currUser = await User.findByPk(currUserId);
    const theSpot = await Spot.findByPk(req.params.spotId);

    if (!theSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    }

    const Bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      }
    });

    const spotBookings = [];

    if (currUserId !== theSpot.ownerId) {
      for (const booking of Bookings) {
        const aBooking = {
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate
        }

        spotBookings.push(aBooking);
      };

      return res.json({ Bookings: spotBookings })
    };

    for (const booking of Bookings) {
      const aBooking = {
        User: {
          id: currUser.id,
          firstName: currUser.firstName,
          lastName: currUser.lastName
        },
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      };

      spotBookings.push(aBooking);
    };

    return res.json({ Bookings: spotBookings })
  }
);

// Create a Booking for a Spot based on the Spot's id
router.post(
  '/:spotId/bookings',
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

    if (theSpot.ownerId !== currUserId) {
      const currentBookings = await Booking.findAll({
        where: { spotId: req.params.spotId }
      });

      const { startDate, endDate } = req.body;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      let invalidDate = false;
      const error = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
      };

      if (start >= end) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            endDate: "endDate cannot be on or before startDate"
          }
        });
      };

      function checkDates(startDate, endDate) {
        const newStartTime = new Date(startDate).getTime();
        const newEndTime = new Date(endDate).getTime();

        for (const booking of currentBookings) {
          const bookingStartTime = new Date(booking.startDate).getTime();
          const bookingEndTime = new Date(booking.endDate).getTime();

          if (newStartTime === bookingStartTime ||
            (newStartTime <= bookingEndTime && newStartTime >= bookingStartTime)) {
            error.errors.startDate = "Start date conflicts with an existing booking";
            invalidDate = true;
          };

          if (newEndTime === bookingEndTime ||
            (newEndTime >= bookingStartTime && newEndTime <= bookingEndTime) ||
            (bookingStartTime > newStartTime && bookingEndTime < newEndTime)) {
            error.errors.endDate = "End date conflicts with an existing booking";
            invalidDate = true;
          };
        };
      };

      checkDates(startDate, endDate);

      if (invalidDate) {
        invalidDate = false;
        return res.status(403).json({ ...error });
      };

      const userId = currUserId;
      const spotId = theSpot.id;

      const newBooking = await Booking.create({ userId, spotId, startDate, endDate });

      const formattedBooking = {
        id: newBooking.id,
        spotId: newBooking.spotId,
        userId: newBooking.userId,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt
      };

      return res.json({
        ...formattedBooking
      })
    };

    return res.status(401).json({ message: 'Current user is the owner of the Spot, and cannot create a booking' });
  }
);

// Edit a Booking
router.put(
  '/:bookingId',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const theBooking = await Booking.findByPk(req.params.bookingId);

    if (!theBooking) {
      return res.status(404).json({
        message: "Booking couldn't be found"
      })
    };

    const theSpot = await Spot.findByPk(theBooking.spotId);

    if (theBooking.userId !== currUserId) {
      return res.status(401).json({
        message: "Booking must belong to the current user"
      })
    };

    const { startDate, endDate } = req.body;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const todayTime = new Date().getTime();

    if (end < todayTime) {
      return res.status(403).json({
        message: "Past bookings can't be modified"
      })
    }

    let invalidDate = false;
    const error = {
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {}
    };

    if (start >= end) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      });
    };

    const currentBookings = await Booking.findAll({
      where: {
        spotId: theSpot.id,
        id: {
          [Op.ne]: req.params.bookingId
        }
      }
    })

    function checkDates(startDate, endDate) {
      const newStartTime = new Date(startDate).getTime();
      const newEndTime = new Date(endDate).getTime();

      for (const booking of currentBookings) {
        const bookingStartTime = new Date(booking.startDate).getTime();
        const bookingEndTime = new Date(booking.endDate).getTime();

        if (newStartTime === bookingStartTime ||
          (newStartTime <= bookingEndTime && newStartTime >= bookingStartTime)) {
          error.errors.startDate = "Start date conflicts with an existing booking";
          invalidDate = true;
        };

        if (newEndTime === bookingEndTime ||
          (newEndTime >= bookingStartTime && newEndTime <= bookingEndTime) ||
          (bookingStartTime > newStartTime && bookingEndTime < newEndTime)) {
          error.errors.endDate = "End date conflicts with an existing booking";
          invalidDate = true;
        };
      };
    };

    checkDates(startDate, endDate);

    if (invalidDate) {
      invalidDate = false;
      return res.status(403).json({ ...error });
    };

    theBooking.set({
      startDate: startDate,
      endDate: endDate
    });

    await theBooking.save();

    const updatedBooking = {
      id: theBooking.id,
      spotId: theBooking.spotId,
      userId: theBooking.userId,
      startDate: theBooking.startDate,
      endDate: theBooking.endDate,
      createdAt: theBooking.createdAt,
      updatedAt: theBooking.updatedAt
    };

    return res.json({
      ...updatedBooking
    })
  }
);

// Delete a Booking
router.delete(
  '/:bookingId',
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      })
    };

    const currUserId = req.user.id;
    const theBooking = await Booking.findByPk(req.params.bookingId);

    if (!theBooking) {
      return res.status(404).json({
        message: "Booking couldn't be found"
      })
    };

    const todayTime = new Date().getTime();
    const startDate = new Date(theBooking.startDate).getTime();

    if (startDate < todayTime) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted"
      })
    };

    const theSpot = await Spot.findByPk(theBooking.spotId);

    if (theBooking.userId === currUserId || theSpot.ownerId === currUserId) {
      await theBooking.destroy();

      return res.json({
        message: "Successfully deleted"
      })
    };
  }
);


module.exports = router;
