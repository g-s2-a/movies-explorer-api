const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');
const AuthorizeError = require('../errors/authorize-err');
const DoubleError = require('../errors/double-err');

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
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Ошибка в id пользователя'));
      } else {
        next(err);
      }
    });
};

const getUserId = (req, res, next) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Ошибка в id пользователя'));
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
    throw new RequestError('Не указан пользователь, или пароль');
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) { // пользователь найден
        throw new DoubleError('Пользователь с таким email уже зарегистрирован');
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
            next(new NotFoundError('Ошибка при создании пользователя - не корректные данные'));
          }
        });
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else {
        next(new AuthorizeError('Ошибка регистрации'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new AuthorizeError('Ошибка аутентификации'));
    });
};

// eslint-disable-next-line max-len
const updateUser = (req, res, next) => User.findByIdAndUpdate(req.user._id, { name: req.body.name }, { new: true, runValidators: true })
  .then((user) => {
    if (user) {
      return res.status(200).send(user);
    }
    throw new NotFoundError('Ошибка при обновлении пользователя. Нет пользователя с таким id');
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new RequestError('Ошибка при обновлении пользователя. Невалидный id.'));
    } else if (err.name === 'ValidationError') {
      next(new RequestError('Ошибка валидации при обновлении пользователя'));
    } else {
      next(err);
    }
  });

// eslint-disable-next-line max-len
const updateAvatarUser = (req, res, next) => {
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFoundError('Ошибка при обновлении аватара пользователя. Нет пользователя с таким id');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Ошибка при обновлении аватара. Невалидный id.'));
      } else if (err.name === 'ValidationError') {
        next(new RequestError('Ошибка валидации при обновлении аватара'));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getUsers, getUser, getUserId, createUser, updateUser, updateAvatarUser, login,
};
