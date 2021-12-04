require('dotenv').config();

const {
  NODE_ENV, MONGO_URL, JWT_SECRET,
} = process.env;

const DEV_JWT_SECRET = 'JWT_SECRET1';
const DEV_MONGO_URL = 'mongodb://localhost:27017/moviesdb';

const MONGO_URL_CURRENT = NODE_ENV === 'production' && MONGO_URL ? MONGO_URL : DEV_MONGO_URL;
const JWT_SECRET_CURRENT = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : DEV_JWT_SECRET;

module.exports = {
  JWT_SECRET: JWT_SECRET_CURRENT,
  MONGO_URL: MONGO_URL_CURRENT,
};
