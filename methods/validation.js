const validator = require('validator');
const RequestError = require('../errors/request-err');

module.exports = (value, message) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new RequestError(message);
  } else {
    return value;
  }
};
