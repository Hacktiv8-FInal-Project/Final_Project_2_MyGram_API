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
      "Comments",
      [
        {
          comment: "comment 1",
          UserId: 1,
          PhotoId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          comment: "comment 2",
          UserId: 1,
          PhotoId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          comment: "comment 3",
          UserId: 1,
          PhotoId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
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
  },
};
