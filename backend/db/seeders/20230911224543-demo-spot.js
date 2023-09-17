'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Wayward Trail",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "John Wayne's House",
        description: "The wild, wild west!",
        price: 350
      },
      {
        ownerId: 2,
        address: "123 Baller's Court",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 38.7645358,
        lng: -122.4730327,
        name: "Stephen Curry's House",
        description: "Ball if life!",
        price: 875
      },
      {
        ownerId: 3,
        address: "123 Kingsley Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 39.7645358,
        lng: -122.4730327,
        name: "LeBron James's House",
        description: "Pays to be King",
        price: 950
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["John Wayne's House", "Stephen Curry's House", "LeBron James's House"] }
    }, {});
  }
};
