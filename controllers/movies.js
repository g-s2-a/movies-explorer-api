const Movie = require('../models/movie');
const { NotFoundError, RequestError, ForbiddenError } = require('../errors/not-found-err');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch((err) => {
    next(err);
  });

const delMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.deleteMany({ movieId: movieId })
  .then((movie1) => {
    if (movie1) {
      return res.status(200).send(movie1);
    }
    throw new NotFoundError('Ошибка при удалении Movie. Нет Movie с таким id');
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new RequestError('Ошибка при удалении Movie. Невалидный movieId.'));
    } else {
      next(err);
    }
  });
};

// eslint-disable-next-line max-len
const createMovie = (req, res, next) => Movie.create({
    country: req.body.country,
    owner: req.user._id,
    director: req.body.director,
    year: req.body.year,
    duration: req.body.duration,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId
  })
  .then((movie) => res.status(200).send(movie))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new RequestError('Некорректные данные'));
    } else {
      next(err);
    }
  });

module.exports = {
  getMovies, delMovie, createMovie,
};
