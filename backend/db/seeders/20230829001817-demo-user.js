'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Wayne',
        email: 'jwayne@user.com',
        username: 'jwayne',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Stephen',
        lastName: 'Curry',
        email: 'scurry@user.com',
        username: 'scurry',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Lebron',
        lastName: 'James',
        email: 'ljames@user.com',
        username: 'ljames',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.com',
        username: 'demo',
        hashedPassword: bcrypt.hashSync('password')
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['jwayne', 'scurry', 'ljames'] }
    }, {});
  }
};
