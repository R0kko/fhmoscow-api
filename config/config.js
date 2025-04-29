require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_NAME,
    host: process.env.MAIN_DB_HOST,
    dialect: 'postgres',
  },

  mariaExternal: {
    username: process.env.MARIA_DB_USER,
    password: process.env.MARIA_DB_PASSWORD,
    database: process.env.MARIA_DB_NAME,
    host: process.env.MARIA_DB_HOST,
    port: process.env.MARIA_DB_PORT || 3306,
    dialect: 'mariadb',

    logging: false,
    pool: { max: 5, min: 0, acquire: 20000, idle: 10000 },
    dialectOptions: {
      connectTimeout: 10000,
    },
  },
};