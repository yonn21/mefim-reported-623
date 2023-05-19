const actorsModel = require("../models/actors");
const commentsModel = require("../models/comments");
const directorsModel = require("../models/directors");
const genresModel = require("../models/genres");
const moviesModel = require("../models/movies");
const ratingsModel = require("../models/ratings");
const usersModel = require("../models/users");

const getDirectorInfo = async (directorUrls) => {
  try {
    const directors = await directorsModel.find(
      { director_url: { $in: directorUrls } },
      { director_name: 1, director_url: 1}
    );
    return directors.map((director) => ({
      director_name: director.director_name,
      director_url: director.director_url,
    }));
  } catch (err) {
    throw new Error("Đã xảy ra lỗi khi truy xuất thông tin đạo diễn");
  }
};

const getActorInfo = async (actorUrls) => {
  try {
    const actors = await actorsModel.find(
      { actor_url: { $in: actorUrls } },
      { actor_name: 1, actor_url: 1}
    );
    return actors.map((actor) => ({
      actor_name: actor.actor_name,
      actor_url: actor.actor_url,
    }));
  } catch (err) {
    throw new Error("Đã xảy ra lỗi khi truy xuất thông tin diễn viên");
  }
};

const getGenreInfo = async (genreUrls) => {
  try {
    const genres = await genresModel.find(
      { genre_url: { $in: genreUrls } },
      { genre_name: 1, genre_url: 1}
    );
    return genres.map((genre) => ({
      genre_name: genre.genre_name,
      genre_url: genre.genre_url,
    }));
  } catch (err) {
    throw new Error("Đã xảy ra lỗi khi truy xuất thông tin thể loại");
  }
};

class MovieController {
  async getAllMovie(req, res, next) {
    try {
      const result = await moviesModel.find({});
      const promises = result.map(async (movie) => {
        movie.directors = await getDirectorInfo(movie.directors);
        movie.actors = await getActorInfo(movie.actors);
        movie.genres = await getGenreInfo(movie.genres);
      });

      await Promise.all(promises);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }

  async getMovieByURL(req, res, next) {
    const url = req.params.url_name;
    try {
      const result = await moviesModel.findOne({ url_name: url });
      if (!result) {
        res.status(404).json({ error: "Không tìm thấy phim" });
      } else {
        result.directors = await getDirectorInfo(result.directors);
        result.actors = await getActorInfo(result.actors);
        result.genres = await getGenreInfo(result.genres);
        res.json(result);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }
}

module.exports = new MovieController();
