'use strict';

// const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.com',
        username: 'Demo-Name',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'fake@user.com',
        username: 'Fake-Name',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'false@user.com',
        username: 'False-Name',
        hashedPassword: bcrypt.hashSync('password3')
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-Name', 'Fake-Name', 'False-Name'] }
    });
  }
};
