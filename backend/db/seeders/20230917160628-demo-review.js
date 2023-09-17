'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        starRating: 5,
        content: "Awesome spot!",
      },
      {
        userId: 2,
        spotId: 3,
        starRating: 5,
        content: "The court is awesome!!!",
      },
      {
        userId: 3,
        spotId: 1,
        starRating: 2,
        content: "Too many cows..",
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
