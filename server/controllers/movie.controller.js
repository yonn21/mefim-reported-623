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
      { director_name: 1, director_url: 1 }
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
      { actor_name: 1, actor_url: 1 }
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
      { genre_name: 1, genre_url: 1 }
    );
    return genres.map((genre) => ({
      genre_name: genre.genre_name,
      genre_url: genre.genre_url,
    }));
  } catch (err) {
    throw new Error("Đã xảy ra lỗi khi truy xuất thông tin thể loại");
  }
};

async function createMovieListToRender(movies) {
  return movies.map((movie) => ({
    url_name: movie.url_name,
    primary_title: movie.primary_title,
    thumbnail: movie.thumbnail,
  }));
}

class MovieController {
  async getMainMovie(req, res, next) {
    try {
      const latestMoviesByType1 = await moviesModel
        .find({ type_url: "phim-le" })
        .sort({ created_at: -1 })
        .limit(12);

      const latestMoviesByGenre = await moviesModel
        .find({ genres: "phim-chieu-rap" })
        .sort({ created_at: -1 })
        .limit(12);

      const latestMoviesByType2 = await moviesModel
        .find({ type_url: "phim-bo" })
        .sort({ created_at: -1 })
        .limit(12);

      const latestMoviesByType1ToRender = await createMovieListToRender(
        latestMoviesByType1
      );
      const latestMoviesByGenreToRender = await createMovieListToRender(
        latestMoviesByGenre
      );
      const latestMoviesByType2ToRender = await createMovieListToRender(
        latestMoviesByType2
      );

      const mainMovies = {
        latestMoviesByType1ToRender,
        latestMoviesByGenreToRender,
        latestMoviesByType2ToRender,
      };

      res.json(mainMovies);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }

  async getAllMovie(req, res, next) {
    try {
      const result = await moviesModel.find({}).sort({ created_at: -1 });

      const moviesToRender = await createMovieListToRender(result);

      res.json(moviesToRender);
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
      const result = await moviesModel
        .findOne({ url_name: url })
        .sort({ created_at: -1 });

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

  async getMovieByDirector(req, res, next) {
    const directorUrl = req.params.director_url;
    try {
      const director = await directorsModel.findOne({
        director_url: directorUrl,
      });

      if (!director) {
        res.status(404).json({ error: "Không tìm thấy đạo diễn" });
        return;
      }

      const moviesPromises = director.director_movies.map(async (urlName) => {
        const movie = await moviesModel.findOne({ url_name: urlName });
        if (movie) {
          return {
            url_name: movie.url_name,
            primary_title: movie.primary_title,
            thumbnail: movie.thumbnail,
          };
        }
      });

      const movies = await Promise.all(moviesPromises);

      const directorInfo = {
        director_url: director.director_url,
        director_name: director.director_name,
        director_thumbnail: director.director_thumbnail,
        director_description: director.director_description,
        director_movies: movies.filter(Boolean),
      };

      res.json(directorInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }

  async getMovieByActor(req, res, next) {
    const actorUrl = req.params.actor_url;
    try {
      const actor = await actorsModel.findOne({
        actor_url: actorUrl,
      });

      if (!actor) {
        res.status(404).json({ error: "Không tìm thấy diễn viên" });
        return;
      }

      const moviesPromises = actor.actor_movies.map(async (urlName) => {
        const movie = await moviesModel.findOne({ url_name: urlName });
        if (movie) {
          return {
            url_name: movie.url_name,
            primary_title: movie.primary_title,
            thumbnail: movie.thumbnail,
          };
        }
      });

      const movies = await Promise.all(moviesPromises);

      const actorInfo = {
        actor_url: actor.actor_url,
        actor_name: actor.actor_name,
        actor_thumbnail: actor.actor_thumbnail,
        actor_description: actor.actor_description,
        actor_movies: movies.filter(Boolean),
      };

      res.json(actorInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }

  async getMovieByGenre(req, res, next) {
    const genreUrl = req.params.genre_url;
    try {
      const genre = await genresModel.findOne({
        genre_url: genreUrl,
      });

      if (!genre) {
        res.status(404).json({ error: "Không tìm thấy đạo diễn" });
        return;
      }

      const moviesPromises = genre.genre_movies.map(async (urlName) => {
        const movie = await moviesModel.findOne({ url_name: urlName });
        if (movie) {
          return {
            url_name: movie.url_name,
            primary_title: movie.primary_title,
            thumbnail: movie.thumbnail,
          };
        }
      });

      const movies = await Promise.all(moviesPromises);

      const genreInfo = {
        genre_url: genre.genre_url,
        genre_name: genre.genre_name,
        genre_thumbnail: genre.genre_thumbnail,
        genre_description: genre.genre_description,
        genre_movies: movies.filter(Boolean),
      };

      res.json(genreInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }

  async getMovieByYear(req, res, next) {
    const year = req.params.year;
    try {
      const movies = await moviesModel
        .find({ year: year })
        .sort({ created_at: -1 });

      const moviesToRender = await createMovieListToRender(movies);

      res.json(moviesToRender);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất chi tiết phim",
      });
    }
  }
  
  async getMovieByCountry(req, res, next) {
    const country_url = req.params.country_url;
    try {
      const movies = await moviesModel
        .find({ country_url: country_url })
        .sort({ created_at: -1 });

      const moviesToRender = await createMovieListToRender(movies);

      res.json(moviesToRender);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất phim theo quốc gia",
      });
    }
  }

  async getMovieByType(req, res, next) {
    const typeUrl = req.params.type_url;
    try {
      const movies = await moviesModel
        .find({ type_url: typeUrl })
        .sort({ created_at: -1 });

      const moviesToRender = await createMovieListToRender(movies);

      res.json(moviesToRender);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất phim theo loại",
      });
    }
  }
}

module.exports = new MovieController();
