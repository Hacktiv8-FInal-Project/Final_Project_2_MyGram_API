"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.User, { foreignKey: 'UserId' })
      comment.belongsTo(models.Photo, { foreignKey: 'PhotoId' })
    }
  }
  comment.init({
    comment: {
      type : DataTypes.TEXT,
      validate : {
        notEmpty : {
          args : true,
          msg : 'Comment cannot be empty'
        }
      }
    },
    PhotoId : {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {
          args : true,
          msg : 'PhotoId cannot be empty'
        },
        isInt : {
          args : true,
          msg : 'PhotoId must be integer'
        }
      }
    }
  },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return comment;
};
