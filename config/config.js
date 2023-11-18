// const dotenv = require('dotenv')
// const path = require('path')
<<<<<<< HEAD
// console.log(dotenv.config({ path: path.join(__dirname, '../.env') }))
require("dotenv").config()
// console.log(process.env);
=======
//console.log(dotenv.config({ path: path.join(__dirname, '../.env') }))//
require("dotenv").config()
>>>>>>> 4d0f30c356603eb69ec5b6219e53962ff8c7772d

const config = {
  "development": {
    "username": process.env.DB_USERNAME_DEV,
    "password": process.env.DB_PASSWORD_DEV,
    "database": process.env.DB_NAME_DEV,
    "host": process.env.DB_HOST_DEV,
    "dialect": process.env.DB_DIALECT_DEV
  },
  "test": {
    "username": process.env.DB_USERNAME_TEST,
    "password": process.env.DB_PASSWORD_TEST,
    "database": process.env.DB_NAME_TEST,
    "host": process.env.DB_HOST_TEST,
    "dialect": process.env.DB_DIALECT_TEST
  },
  "production": {
    "username": process.env.DB_USERNAME_PROD,
    "password": process.env.DB_PASSWORD_PROD,
    "database": process.env.DB_NAME_PROD,
    "host": process.env.DB_HOST_PROD,
    "dialect": process.env.DB_DIALECT_PROD,
    "port": process.env.DB_PORT_PROD
    // "url": process.env.DB_URL_PROD
  }
}

module.exports = config
