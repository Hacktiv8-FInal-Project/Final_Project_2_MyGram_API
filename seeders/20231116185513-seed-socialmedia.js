"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "SocialMedia",
      [
        {
          name: "Instagram",
          social_media_url: "https://www.instagram.com/instagram/",
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: 1,
        },
        {
          name: "Facebook",
          social_media_url: "https://www.facebook.com/facebook/",
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: 1,
        },
        {
          name: "Twitter",
          social_media_url: "https://twitter.com/Twitter",
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: 1,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("SocialMedia", null, {});
  },
};
