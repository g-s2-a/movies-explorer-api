const jwt = require('jsonwebtoken');
const { AuthorizeError } = require('../errors/index');
const { JWT_SECRET } = require('../settings/environment-variables');
const { AUTHORIZATION_REQUIRED, AUTHORIZATION_ERROR } = require('../settings/const');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizeError(AUTHORIZATION_REQUIRED);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizeError(AUTHORIZATION_ERROR);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  req.token = token;
  next(); // пропускаем запрос дальше
};
