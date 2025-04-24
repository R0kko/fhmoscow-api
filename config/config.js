require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_NAME,
    host: process.env.MAIN_DB_HOST,
    dialect: 'postgres',
  },
};