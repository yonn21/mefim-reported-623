const actors = require("../models/actors");
const comments = require("../models/comments");
const directors = require("../models/directors");
const genres = require("../models/genres");
const movies = require("../models/movies");
const ratings = require("../models/ratings");
const users = require("../models/users");

class MovieController {
  getAllMovie(req, res, next) {
    movies.find({}, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving movies" });
      } else {
        res.json(result);
      }
    });
  }

  getMovieByID(req, res, next) {
    const movieId = req.params.id;
    movies.findById(movieId, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving movie details" });
      } else if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: "Movie not found" });
      }
    });
  }

  getMovieByTitle(req, res, next) {
    const name = req.params.url_name;
    movies.findOne({ url_name: name }, (err, movie) => {
      if (err) {
        return next(err);
      }
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    });
  }
}

module.exports = new MovieController();
