const actors = require("../models/actors");
const comments = require("../models/comments");
const directors = require("../models/directors");
const genres = require("../models/genres");
const movies = require("../models/movies");
const ratings = require("../models/ratings");
const users = require("../models/users");

const getDirectorNames = (directorUrl) => {
  return directors.find(
    { director_url: { $in: directorUrl } },
    "director_name"
  );
};

const getActorNames = (actorUrl) => {
  return actors.find({ actor_url: { $in: actorUrl } }, "actor_name");
};

const getGenreNames = (genreUrl) => {
  return genres.find({ genre_url: { $in: genreUrl } }, "genre_name");
};

class MovieController {
  getAllMovie(req, res, next) {
    movies.find({}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất phim" });
      } else {
        const promises = result.map((movie) => {
          const directorPromise = getDirectorNames(movie.directors).then(
            (directors) => {
              movie.directors = directors.map(
                (director) => director.director_name
              );
            }
          );

          const actorPromise = getActorNames(movie.actors).then((actors) => {
            movie.actors = actors.map((actor) => actor.actor_name);
          });

          const genrePromise = getGenreNames(movie.genres).then((genres) => {
            movie.genres = genres.map((genre) => genre.genre_name);
          });

          return Promise.all([directorPromise, actorPromise, genrePromise]);
        });

        Promise.all(promises)
          .then(() => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
            });
          });
      }
    });
  }

  getMovieByURL(req, res, next) {
    const url = req.params.url_name;

    movies.findOne({ primary_title: url }, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất phim" });
      } else if (!result) {
        res.status(404).json({ error: "Không tìm thấy phim" });
      } else {
        const promises = [];

        const directorPromise = getDirectorNames(result.directors).then(
          (directors) => {
            result.directors = directors.map(
              (director) => director.director_name
            );
          }
        );
        promises.push(directorPromise);

        const actorPromise = getActorNames(result.actors).then((actors) => {
          result.actors = actors.map((actor) => actor.actor_name);
        });
        promises.push(actorPromise);

        const genrePromise = getGenreNames(result.genres).then((genres) => {
          result.genres = genres.map((genre) => genre.genre_name);
        });
        promises.push(genrePromise);

        Promise.all(promises)
          .then(() => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ error: "Đã xảy ra lỗi khi truy xuất chi tiết phim" });
          });
      }
    });
  }
}

module.exports = new MovieController();
