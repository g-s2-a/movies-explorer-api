const RequestError = require('./request-err');
const AuthorizeError = require('./authorize-err');
const DoubleError = require('./double-err');
const ForbiddenError = require('./forbidden-err');
const NotFoundError = require('./not-found-err');

module.exports = {
  RequestError,
  ForbiddenError,
  DoubleError,
  AuthorizeError,
  NotFoundError,
};
