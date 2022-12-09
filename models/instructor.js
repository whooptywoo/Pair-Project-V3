'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Instructor.belongsTo(models.User)
      Instructor.hasOne(models.Course)
    }
  }
  Instructor.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name is required'
        },
        notEmpty: {
          msg: 'name is required'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Instructor',
  });
  return Instructor;
};