const dotenv = require('dotenv').config();
const connect = {
  database: process.env.DB,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
 
module.exports = connect;
