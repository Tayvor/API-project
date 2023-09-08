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
        firstName: 'Demo',
        lastName: 'the-demo',
        email: 'demo@user.com',
        username: 'Demo-Name',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Fake',
        lastName: 'the-fake',
        email: 'fake@user.com',
        username: 'Fake-Name',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'False',
        lastName: 'the-false',
        email: 'false@user.com',
        username: 'False-Name',
        hashedPassword: bcrypt.hashSync('password3')
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-Name', 'Fake-Name', 'False-Name'] }
    }, {});
  }
};
