'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Instructor)
      User.hasOne(models.Student)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'email is required'
        },
        notEmpty: {
          msg: 'email is required'
        }, 
        isEmail: {
          msg: 'Please input correct format email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required'
        },
        notEmpty: {
          msg: 'password is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', (instance, options) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(instance.password, salt)

    instance.password = hash
  })

  return User;
};