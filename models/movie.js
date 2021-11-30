const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  country: { // страна создания фильма. Обязательное поле-строка.:
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
   director: { // режиссёр фильма. Обязательное поле-строка.:
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  year: { // длительность фильма. Обязательное поле-число:
    type: Number,
    required: true,
  },
  duration: { // год выпуска фильма. Обязательное поле-строка.
    type: Number,
    required: true,
  },
 description: { // описание фильма. Обязательное поле-строка.:
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  image: { // ссылка на постер к фильму. Обязательное поле-строка. URL-адресом.
    type: String, //  — это строка
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
 trailer: { // ссылка на трейлер фильма. Обязательное поле-строка. URL-адресом.
    type: String, //  — это строка
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму. Обязательное поле-строка. URL-адресом.
    type: String, //  — это строка
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  nameRU: { // название фильма на русском языке. Обязательное поле-строка.
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  nameEN: { // название фильма на английском языке. Обязательное поле-строка.
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
});

module.exports = mongoose.model('movie', movieSchema);
