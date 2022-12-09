'use strict';
const {
  Model
} = require('sequelize');

const splitter = require('../helpers/splitter.js')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.Student,{through:models.Enrollment})
      Course.belongsTo(models.Instructor)
    }

    splitSchedule(string, separator) {
      return splitter(string, separator);
    }
    
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    schedule: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};