"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SocialMedia.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  SocialMedia.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "name is required",
          },
        },
      },
      social_media_url: {
        type: DataTypes.TEXT,
        validate: {
          isUrl: {
            args: true,
            msg: "social_media_url must be in URL format",
          },
          notEmpty: {
            args: true,
            msg: "social_media_url is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SocialMedia",
    }
  );
  return SocialMedia;
};
