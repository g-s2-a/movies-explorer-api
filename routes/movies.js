const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validation = require('../methods/validation');

const {
  getMovies, delMovie, createMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    year: Joi.number(),
    duration: Joi.number(),
    description: Joi.string().required().min(2).max(100),
    image: Joi.required().custom((e) => validation(e, 'Не верная ссылка на изображение')),
    trailer: Joi.required().custom((e) => validation(e, 'Не верная ссылка на trailer')),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    thumbnail: Joi.required().custom((e) => validation(e, 'Не верная ссылка на thumbnail')),
    movieId: Joi.string().length(24).required().hex()
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).required().hex(),
  }),

}), delMovie);

module.exports = router;
