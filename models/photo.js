"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate(models) {
      Photo.belongsTo(models.User, {
        foreignKey: "UserId",
        onDelete: "CASCADE",
      });
    }
  }

  Photo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title is required",
          },
        },
      },

      caption: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Caption is required",
          },
        },
      },

      poster_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "PosterUrl is required",
          },
          isUrl: {
            args: true,
            msg: "Invalid URL format for Poster",
          },
        },
      },

      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Photo",
    }
  );

  return Photo;
};
