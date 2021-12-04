const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, updateUser,
} = require('../controllers/users');

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().required().email(),
  }),
}), updateUser); // — обновляет профиль

router.get('/users/me', getUser);

module.exports = router;
