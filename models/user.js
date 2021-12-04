const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const { ERROR_EMAIL_PASS, INVALID_EMAIL } = require('../settings/const');
const { AuthorizeError } = require('../errors/index');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, INVALID_EMAIL],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUser = function findUsr(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizeError(ERROR_EMAIL_PASS));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizeError(ERROR_EMAIL_PASS));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
