require('dotenv').config();

module.exports = {
  development: {
    username: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    host: process.env.NEXT_PUBLIC_DB_HOST,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    host: process.env.NEXT_PUBLIC_DB_HOST,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    host: process.env.NEXT_PUBLIC_DB_HOST,
    dialect: 'mysql',
    logging: false
  }
};