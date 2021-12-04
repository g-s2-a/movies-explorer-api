const Movie = require('../models/movie');
const { INVALID_ID, FORBIDDEN, VALIDATION_ERROR } = require('../settings/const');
const {
  ForbiddenError, RequestError, NotFoundError,
} = require('../errors/index');

const getMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => res.status(200).send(movies))
  .catch((err) => {
    next(err);
  });

const delMovie = (req, res, next) => {
  const { id } = req.params;
  return Movie.findById(id)
    .then((movie1) => {
      if (movie1) {
        if (movie1.owner._id.toString() === req.user._id) {
          return Movie.findByIdAndRemove(id)
            .then((movie2) => res.status(200).send(movie2));
        }
        throw new ForbiddenError(FORBIDDEN);
      } else {
        throw new NotFoundError(INVALID_ID);
      }
    })
    .catch((err) => {
      next(err);
    });
};

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
  movieId: req.body.movieId,
})
  .then((movie) => res.status(200).send(movie))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new RequestError(VALIDATION_ERROR));
    } else {
      next(err);
    }
  });

module.exports = {
  getMovies, delMovie, createMovie,
};
