'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.User)
      Student.belongsToMany(models.Course,{through:models.Enrollment})
    }

    static checkStatus() {
      return 'Finished'
    }
    
    getBirthday(dob) {
      const year = dob.toLocaleString("default", { year: "numeric" });
      const month = dob.toLocaleString("default", { month: "2-digit" });
      const day = dob.toLocaleDateString("default", { day: "2-digit" });
      const formattedDate = day + "-" + month + "-" + year;
      return formattedDate;
  }
  }
  Student.init({
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
    dob: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};