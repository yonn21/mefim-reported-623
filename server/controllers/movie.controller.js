const actorsModel = require("../models/actors");
const commentsModel = require("../models/comments");
const directorsModel = require("../models/directors");
const genresModel = require("../models/genres");
const moviesModel = require("../models/movies");
const ratingsModel = require("../models/ratings");
const usersModel = require("../models/users");

var HOST_SERVER = "http://localhost:6969";

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
    cover_image: movie.cover_image,
  }));
}

async function createMovieListByYearToRender(movies, year) {
  const movieList = movies.map((movie) => ({
    url_name: movie.url_name,
    primary_title: movie.primary_title,
    thumbnail: movie.thumbnail,
    cover_image: movie.cover_image,
  }));

  return {
    year: year,
    year_movies: movieList,
  };
}

async function createMovieListByCountryToRender(movies, country_url) {
  const movieList = movies.map((movie) => ({
    url_name: movie.url_name,
    primary_title: movie.primary_title,
    thumbnail: movie.thumbnail,
    cover_image: movie.cover_image,
  }));

  const country = movies.length > 0 ? movies[0].country : "Chưa có phim";

  return {
    country_url: country_url,
    country: country,
    country_movies: movieList,
  };
}

async function createMovieListByTypeToRender(movies, type_url) {
  const movieList = movies.map((movie) => ({
    url_name: movie.url_name,
    primary_title: movie.primary_title,
    thumbnail: movie.thumbnail,
    cover_image: movie.cover_image,
  }));

  const type = movies.length > 0 ? movies[0].type : "Chưa có phim";

  return {
    type_url: type_url,
    type: type,
    type_movies: movieList,
  };
}

const replaceMoviesArrayPublicPath = (movies) => {
  return movies.map((movie) => {
    movie.thumbnail = movie.thumbnail.replace(
      "/./public",
      HOST_SERVER + "/public"
    );
    movie.cover_image = movie.cover_image.replace(
      "/./public",
      HOST_SERVER + "/public"
    );
    return movie;
  });
};

const replaceMoviePublicPath = (movie) => {
  movie.thumbnail = movie.thumbnail.replace(
    "/./public",
    HOST_SERVER + "/public"
  );
  movie.cover_image = movie.cover_image.replace(
    "/./public",
    HOST_SERVER + "/public"
  );
  return movie;
};

const replaceDirectorPublicPath = (data) => {
  data.director_thumbnail = data.director_thumbnail.replace(
    "/public",
    HOST_SERVER + "/public"
  );
  data.director_movies.forEach((movie) => {
    if (movie.thumbnail) {
      movie.thumbnail = movie.thumbnail.replace(
        "/./public",
        HOST_SERVER + "/public"
      );
    }
    if (movie.cover_image) {
      movie.cover_image = movie.cover_image.replace(
        "/./public",
        HOST_SERVER + "/public"
      );
    }
  });
  return data;
};

const replaceActorPublicPath = (data) => {
  data.actor_thumbnail = data.actor_thumbnail.replace(
    "/public",
    HOST_SERVER + "/public"
  );
  data.actor_movies.forEach((movie) => {
    if (movie.thumbnail) {
      movie.thumbnail = movie.thumbnail.replace(
        "/./public",
        HOST_SERVER + "/public"
      );
    }
    if (movie.cover_image) {
      movie.cover_image = movie.cover_image.replace(
        "/./public",
        HOST_SERVER + "/public"
      );
    }
  });
  return data;
};

const replaceGenrePublicPath = (data) => {
  data.genre_movies.forEach((movie) => {
    if (movie.thumbnail) {
      movie.thumbnail = movie.thumbnail.replace(
        "/./public",
        HOST_SERVER + "/public"
      );
    }
    if (movie.cover_image) {
      movie.cover_image = movie.cover_image.replace(
        "/./public",
        HOST_SERVER + "/public"
      );
    }
  });
  return data;
};

class MovieController {
  async getMainMovie(req, res, next) {
    try {
      const latestMoviesByType1 = await moviesModel
        .find({ type_url: "phim-le" })
        .sort({ created_at: -1 })
        .limit(12);
      const latestMoviesByType1Path = await replaceMoviesArrayPublicPath(
        latestMoviesByType1
      );

      const latestMoviesByGenre = await moviesModel
        .find({ genres: "phim-chieu-rap" })
        .sort({ created_at: -1 })
        .limit(12);
      const latestMoviesByGenrePath = await replaceMoviesArrayPublicPath(
        latestMoviesByGenre
      );

      const latestMoviesByType2 = await moviesModel
        .find({ type_url: "phim-bo" })
        .sort({ created_at: -1 })
        .limit(12);
      const latestMoviesByType2Path = await replaceMoviesArrayPublicPath(
        latestMoviesByType2
      );

      const latestMoviesByType1ToRender = await createMovieListToRender(
        latestMoviesByType1Path
      );
      const latestMoviesByGenreToRender = await createMovieListToRender(
        latestMoviesByGenrePath
      );
      const latestMoviesByType2ToRender = await createMovieListToRender(
        latestMoviesByType2Path
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
      const resultPath = replaceMoviesArrayPublicPath(result);

      const moviesToRender = await createMovieListToRender(resultPath);

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
      const resultPath = replaceMoviePublicPath(result);

      if (!result) {
        res.status(404).json({ error: "Không tìm thấy phim" });
      } else {
        resultPath.directors = await getDirectorInfo(result.directors);
        resultPath.actors = await getActorInfo(result.actors);
        resultPath.genres = await getGenreInfo(result.genres);

        res.json(resultPath);
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
            cover_image: movie.cover_image,
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

      const directorInfoPath = replaceDirectorPublicPath(directorInfo);

      res.json(directorInfoPath);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất phim theo đạo diễn",
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
            cover_image: movie.cover_image,
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

      const actorInfoPath = replaceActorPublicPath(actorInfo);

      res.json(actorInfoPath);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất phim theo diễn viên",
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
        res.status(404).json({ error: "Không tìm thấy thể loại" });
        return;
      }

      const moviesPromises = genre.genre_movies.map(async (urlName) => {
        const movie = await moviesModel.findOne({ url_name: urlName });
        if (movie) {
          return {
            url_name: movie.url_name,
            primary_title: movie.primary_title,
            thumbnail: movie.thumbnail,
            cover_image: movie.cover_image,
          };
        }
      });

      const movies = await Promise.all(moviesPromises);

      const genreInfo = {
        genre_url: genre.genre_url,
        genre_name: genre.genre_name,
        genre_description: genre.genre_description,
        genre_movies: movies.filter(Boolean),
      };

      const genreInfoPath = replaceGenrePublicPath(genreInfo);

      res.json(genreInfoPath);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất phim theo thể loại",
      });
    }
  }

  async getMovieByYear(req, res, next) {
    const year = req.params.year;
    try {
      const movies = await moviesModel
        .find({ year: year })
        .sort({ created_at: -1 });
      const moviesPath = replaceMoviesArrayPublicPath(movies);

      const moviesToRender = await createMovieListByYearToRender(
        moviesPath,
        year
      );

      res.json(moviesToRender);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi truy xuất phim theo năm",
      });
    }
  }

  async getMovieByCountry(req, res, next) {
    const country_url = req.params.country_url;
    try {
      const movies = await moviesModel
        .find({ country_url: country_url })
        .sort({ created_at: -1 });
      const moviesPath = replaceMoviesArrayPublicPath(movies);

      const moviesToRender = await createMovieListByCountryToRender(
        moviesPath,
        country_url
      );

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
      const moviesPath = replaceMoviesArrayPublicPath(movies);

      const moviesToRender = await createMovieListByTypeToRender(
        moviesPath,
        typeUrl
      );

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
