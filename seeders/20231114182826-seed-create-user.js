'use strict';
const { hashPassword } = require('../utils/bcrypt.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        full_name: 'joni',
        email: 'joni@example.com',
        username: 'jon',
        password: hashPassword('123'),
        profile_image_url: 'https://example.com/joni.jpg',
        age: 30,
        phone_number: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        full_name: 'res',
        email: 'res@example.com',
        username: 'res',
        password: hashPassword('456'),
        profile_image_url: 'https://example.com/res.jpg',
        age: 25,
        phone_number: '9876543210',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        full_name: 'Bobi',
        email: 'bob@example.com', 
        username: 'bobi',
        password: hashPassword('789'),
        profile_image_url: 'https://example.com/bobi.jpg',
        age: 40,
        phone_number: '5555555555',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { 
        full_name: 'Alya',
        email: 'alya@example.com', 
        username: 'alya', 
        password: hashPassword('789'),
        profile_image_url: 'https://example.com/alya.jpg',
        age: 35,
        phone_number: '1111111111',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('People', null, {});
  }
};
