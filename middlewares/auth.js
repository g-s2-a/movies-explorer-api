const jwt = require('jsonwebtoken');
const AuthorizeError = require('../errors/authorize-err');
const { JWT_SECRET } = require('../settings/environment-variables');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizeError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizeError('Ошибка авторизации');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  req.token = token;
  next(); // пропускаем запрос дальше
};
