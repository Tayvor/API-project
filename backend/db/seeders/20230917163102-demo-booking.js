'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        startDate: "2021-01-01",
        endDate: "2021-01-03",
      },
      {
        userId: 2,
        spotId: 3,
        startDate: "2022-02-02",
        endDate: "2022-02-04",
      },
      {
        userId: 3,
        spotId: 1,
        startDate: "2023-03-03",
        endDate: "2023-03-05",
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
