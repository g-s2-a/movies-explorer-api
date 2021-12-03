const rateLimit = require('express-rate-limit');

const { SPEED_LIMIT } = require('../settings/const');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 30, // запросов с каждого IP
  message: SPEED_LIMIT,
});

//  apply to all requests
module.exports = limiter;
