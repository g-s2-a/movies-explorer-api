const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../settings/environment-variables');
const {
  INVALID_ID, VALIDATION_ERROR, DOUBLE, NOT_FILLING, REGISTRATION_ERROR, AUTHENTICATION_ERROR,
} = require('../settings/const');
const {
  AuthorizeError, RequestError, NotFoundError, DoubleError,
} = require('../errors/index');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    next(err);
  });

const getUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFoundError(INVALID_ID);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(INVALID_ID));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    throw new RequestError(NOT_FILLING);
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) { // пользователь найден
        throw new DoubleError(DOUBLE);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          const user1 = user.toObject();
          delete user1.password;
          res.status(200).send(user1);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new NotFoundError(VALIDATION_ERROR));
          }
        });
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else {
        next(new AuthorizeError(REGISTRATION_ERROR));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new AuthorizeError(AUTHENTICATION_ERROR));
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFoundError(INVALID_ID);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(INVALID_ID));
      } else if (err.name === 'ValidationError') {
        next(new RequestError(VALIDATION_ERROR));
      } else if (err.code === 11000) {
        next(new DoubleError(DOUBLE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, login,
};
