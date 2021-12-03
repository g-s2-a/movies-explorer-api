const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL } = require('./settings/environment-variables');
const limiter = require('./methods/limit');
const { WRONG_WAY } = require('./settings/const');

const PORT = 4000;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(express.json());

// устанавливаем заголовки безопасности
app.use(helmet());

// CORS-запросы
app.use(cors);

app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError(WRONG_WAY));
});

app.use(limiter);
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => { console.log('Сервер работает - MOVIES'); });
