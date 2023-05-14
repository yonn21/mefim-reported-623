const fs = require("fs");
const path = require("path");

const actors = require("../models/actors");
const admins = require("../models/admins");
const comments = require("../models/comments");
const directors = require("../models/directors");
const genres = require("../models/genres");
const movies = require("../models/movies");
const ratings = require("../models/ratings");
const users = require("../models/users");

class AdminController {
  getLoginPage(req, res, next) {
    res.render("login", { message: req.flash("error") });
  }

  getLogout(req, res, next) {
    req.logout();
    res.redirect("/admin/login");
  }

  getDashboardPage(req, res, next) {
    if (req.isAuthenticated()) {
      movies.find({}, (err, movieResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            res.render("dashboard", {
              message: req.flash("success"),
              admin: adminResult,
              movies: movieResult,
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // Movie manager
  getMovieManagerPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      movies.find({}, (err, movieResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            directors.find({}, (err, directorResult) => {
              actors.find({}, (err, actorResult) => {
                genres.find({}, (err, genreResult) => {
                  ratings.find({}, (err, ratingResult) => {
                    comments.find({}, (err, commentResult) => {
                      res.render("movie-management", {
                        message: req.flash("success"),
                        page: 1,
                        numberItemPerPage: numberItemPerPage,
                        admin: adminResult,
                        movies: movieResult,
                        directors: directorResult,
                        actors: actorResult,
                        genres: genreResult,
                        ratings: ratingResult,
                        comments: commentResult,
                      });
                    });
                  });
                });
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  getMovieManagerAtPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      var page = req.params.page;
      movies.find({}, (err, movieResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            directors.find({}, (err, directorResult) => {
              actors.find({}, (err, actorResult) => {
                genres.find({}, (err, genreResult) => {
                  ratings.find({}, (err, ratingResult) => {
                    comments.find({}, (err, commentResult) => {
                      res.render("movie-management", {
                        message: req.flash("success"),
                        page: page,
                        numberItemPerPage: numberItemPerPage,
                        admin: adminResult,
                        movies: movieResult,
                        directors: directorResult,
                        actors: actorResult,
                        genres: genreResult,
                        ratings: ratingResult,
                        comments: commentResult,
                      });
                    });
                  });
                });
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // add movie
  getAddMoviePage(req, res, next) {
    if (req.isAuthenticated()) {
      admins.findOne(
        { "loginInformation.username": req.session.passport.user.username },
        (err, adminResult) => {
          directors.find({}, (err, directorResult) => {
            actors.find({}, (err, actorResult) => {
              genres.find({}, (err, genreResult) => {
                res.render("movie-add", {
                  admin: adminResult,
                  directors: directorResult,
                  actors: actorResult,
                  genres: genreResult,
                });
              });
            });
          });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postCheckDuplicateMovieURL(req, res, next) {
    var urlName = req.body.url_name;

    movies.findOne({ url_name: urlName }, function (err, movie) {
      if (err) {
        res
          .status(500)
          .json({ error: "Đã xảy ra lỗi trong quá trình kiểm tra URL." });
      } else if (movie) {
        res.json({ isDuplicate: true });
      } else {
        res.json({ isDuplicate: false });
      }
    });
  }

  postAddMovie(req, res, next) {
    if (req.isAuthenticated()) {
      var data = {
        url_name: req.body.url_name,
        primary_title: req.body.primary_title,
        secondary_title: req.body.secondary_title,
        directors: req.body.directors,
        actors: req.body.actors,
        genres: req.body.genres,
        year: req.body.year,
        country: req.body.country,
        type: req.body.type,
        type_url: "",
        duration: "",
        type_sub: req.body.type_sub,
        trailer: req.body.trailer,
        episodes: req.body.episodes,
        summary: req.body.summary,
        thumbnail: `/${req.files["thumbnail"][0].path}`,
        cover_image: `/${req.files["cover_image"][0].path}`,
        rating: [],
        comment: [],
        views_3days: 0,
        views_week: 0,
        views_month: 0,
        views_year: 0,
        views_all: 0,
        number_favourited: 0,
      };

      if (data.type === "Phim lẻ") {
        data.type_url = "phim-le";

        var duration_hours = req.body.duration_hours || "";
        var duration_minutes = req.body.duration_minutes || "";
        var durationString = "";

        if (duration_hours > 0) {
          durationString += `${duration_hours} giờ `;
        }

        if (duration_minutes > 0) {
          durationString += `${duration_minutes} phút`;
        }

        data.duration = durationString.trim();
      } else {
        data.type_url = "phim-bo";
        data.duration = (req.body.duration || "") + " tập";
      }

      const updateDirectorMovies = (directorId, movieId) => {
        directors.findByIdAndUpdate(
          directorId,
          { $push: { director_movies: movieId } },
          (err) => {
            if (err) {
              console.log(
                `Cập nhật đạo diễn không thành công với ID:: ${directorId}`
              );
            }
          }
        );
      };

      const updateActorMovies = (actorId, movieId) => {
        actors.findByIdAndUpdate(
          actorId,
          { $push: { actor_movies: movieId } },
          (err) => {
            if (err) {
              console.log(
                `Cập nhật diễn viên không thành công với ID:: ${actorId}`
              );
            }
          }
        );
      };

      const updateGenreMovies = (genreId, movieId) => {
        genres.findByIdAndUpdate(
          genreId,
          { $push: { genre_movies: movieId } },
          (err) => {
            if (err) {
              console.log(
                `Cập nhật thể loại không thành công với ID:: ${genreId}`
              );
            }
          }
        );
      };

      const movieDirectory = `./public/uploads/movies/${data.url_name}`;
      data.thumbnail = `/${movieDirectory}/${req.files["thumbnail"][0].filename}`;
      data.cover_image = `/${movieDirectory}/${req.files["cover_image"][0].filename}`;

      var newMovie = new movies(data);
      newMovie
        .save()
        .then((savedMovie) => {
          const directorsArr = Array.isArray(req.body.directors)
            ? req.body.directors
            : [req.body.directors];
          directorsArr.forEach((directorId) => {
            updateDirectorMovies(directorId, savedMovie._id);
          });
          const actorsArr = Array.isArray(req.body.actors)
            ? req.body.actors
            : [req.body.actors];
          actorsArr.forEach((actorId) => {
            updateActorMovies(actorId, savedMovie._id);
          });
          const genresArr = Array.isArray(req.body.genres)
            ? req.body.genres
            : [req.body.genres];
          genresArr.forEach((genreId) => {
            updateGenreMovies(genreId, savedMovie._id);
          });

          req.flash("success", "Thêm phim thành công!");
          res.redirect("/admin/movie-management/page-1");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Thêm phim không thành công! Có lỗi xảy ra!");
          res.redirect("/admin/movie-management/page-1");
        });
    } else {
      res.redirect("/admin/login");
    }
  }

  // edit movie
  getUpdateMoviePage(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
    } else {
      res.redirect("/admin/login");
    }
  }

  postUpdateMovie(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
    } else {
      res.redirect("/admin/login");
    }
  }

  // remove movie
  getDeleteMovieInfo(req, res, next) {
    if (req.isAuthenticated()) {
      var url_name = req.params.url_name;
      movies.findOneAndRemove({ url_name: url_name }, (err, result) => {
        if (err) {
          console.log(err);
          req.flash("error", "Xóa phim không thành công! Có lỗi xảy ra!");
          next();
        }
        if (result && result.thumbnail && result.cover_image) {
          const thumbnailPath = path.join(__dirname, "../", result.thumbnail);
          fs.unlink(thumbnailPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
          const coverPath = path.join(__dirname, "../", result.cover_image);
          fs.unlink(coverPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
          const folderPath = path.join(
            __dirname,
            "../public/uploads/movies/",
            result.url_name
          );
          try {
            fs.rmdirSync(folderPath, { recursive: false });
            // console.log('Thư mục đã được xóa thành công.');
          } catch (err) {
            console.error('Lỗi khi xóa thư mục:', err);
          }
        }

        req.flash("success", "Xóa phim thành công!");
        res.redirect("/admin/movie-management/page-1");
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // Director manager
  getDirectorManagerPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      directors.find({}, (err, directorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render("director-management", {
                message: req.flash("success"),
                page: 1,
                numberItemPerPage: numberItemPerPage,
                admin: adminResult,
                movies: movieResult,
                directors: directorResult,
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  getDirectorManagerAtPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      var page = req.params.page;
      directors.find({}, (err, directorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render("director-management", {
                message: req.flash("success"),
                page: page,
                numberItemPerPage: numberItemPerPage,
                admin: adminResult,
                movies: movieResult,
                directors: directorResult,
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // add director
  getAddDirectorPage(req, res, next) {
    if (req.isAuthenticated()) {
      admins.findOne(
        { "loginInformation.username": req.session.passport.user.username },
        (err, adminResult) => {
          res.render("director-add", {
            admin: adminResult,
          });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postCheckDuplicateDirectorURL(req, res, next) {
    var urlName = req.body.director_url;

    directors.findOne({ director_url: urlName }, function (err, director) {
      if (err) {
        res
          .status(500)
          .json({ error: "Đã xảy ra lỗi trong quá trình kiểm tra URL." });
      } else if (director) {
        res.json({ isDuplicate: true });
      } else {
        res.json({ isDuplicate: false });
      }
    });
  }

  postAddDirector(req, res, next) {
    if (req.isAuthenticated()) {
      var data = {
        director_url: req.body.director_url,
        director_name: req.body.director_name,
        director_thumbnail: `/${req.file.path}`,
        director_description: req.body.director_description,
      };
      var newDirector = new directors(data);
      newDirector
        .save()
        .then(() => {
          req.flash("success", "Thêm đạo diễn thành công!");
          res.redirect("/admin/director-management/page-1");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Thêm đạo diễn không thành công! Có lỗi xảy ra!");
        });
    } else {
      res.redirect("/admin/login");
    }
  }

  // edit director
  getUpdateDirectorPage(req, res, next) {
    if (req.isAuthenticated()) {
      var director_url = req.params.director_url;
      directors.findOne(
        { director_url: director_url },
        (err, directorResult) => {
          admins.findOne(
            { "loginInformation.username": req.session.passport.user.username },
            (err, adminResult) => {
              res.render("director-edit", {
                director: directorResult,
                admin: adminResult,
              });
            }
          );
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postUpdateDirector(req, res, next) {
    if (req.isAuthenticated()) {
      var director_url = req.params.director_url;
      directors.findOne(
        { director_url: director_url },
        (err, directorResult) => {
          var data = {
            director_name: req.body.director_name,
            director_description: req.body.director_description,
          };

          if (req.file) {
            if (directorResult && directorResult.director_thumbnail) {
              const thumbnailPath = path.join(
                __dirname,
                "../",
                directorResult.director_thumbnail
              );
              fs.unlink(thumbnailPath, (err) => {
                if (err) {
                  console.log(err);
                }
              });

              data.director_thumbnail = `/${req.file.path}`;
            }
          } else {
            data.director_thumbnail = directorResult.director_thumbnail;
          }

          directors
            .findOneAndUpdate({ director_url: director_url }, data, {
              new: true,
            })
            .then(() => {
              req.flash("success", "Cập nhật thông tin đạo diễn thành công!");
              res.redirect("/admin/director-management/page-1");
            })
            .catch((err) => {
              req.flash(
                "error",
                "Cập nhật thông tin đạo diễn không thành công! Có lỗi xảy ra!"
              );
              next();
            });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  // remove director
  getDeleteDirectorInfo(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      directors.findOneAndRemove({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
          req.flash("error", "Xóa đạo diễn không thành công! Có lỗi xảy ra!");
          next();
        }
        if (result && result.director_thumbnail) {
          const thumbnailPath = path.join(
            __dirname,
            "../",
            result.director_thumbnail
          );
          fs.unlink(thumbnailPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }

        req.flash("success", "Xóa đạo diễn thành công!");
        res.redirect("/admin/director-management/page-1");
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // Actor manager
  getActorManagerPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      actors.find({}, (err, actorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render("actor-management", {
                message: req.flash("success"),
                page: 1,
                numberItemPerPage: numberItemPerPage,
                admin: adminResult,
                movies: movieResult,
                actors: actorResult,
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  getActorManagerAtPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      var page = req.params.page;
      actors.find({}, (err, actorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render("actor-management", {
                message: req.flash("success"),
                page: page,
                numberItemPerPage: numberItemPerPage,
                admin: adminResult,
                movies: movieResult,
                actors: actorResult,
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // add actor
  getAddActorPage(req, res, next) {
    if (req.isAuthenticated()) {
      admins.findOne(
        { "loginInformation.username": req.session.passport.user.username },
        (err, adminResult) => {
          res.render("actor-add", {
            admin: adminResult,
          });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postCheckDuplicateActorURL(req, res, next) {
    var urlName = req.body.actor_url;

    actors.findOne({ actor_url: urlName }, function (err, actor) {
      if (err) {
        res
          .status(500)
          .json({ error: "Đã xảy ra lỗi trong quá trình kiểm tra URL." });
      } else if (actor) {
        res.json({ isDuplicate: true });
      } else {
        res.json({ isDuplicate: false });
      }
    });
  }

  postAddActor(req, res, next) {
    if (req.isAuthenticated()) {
      var data = {
        actor_url: req.body.actor_url,
        actor_name: req.body.actor_name,
        actor_thumbnail: `/${req.file.path}`,
        actor_description: req.body.actor_description,
      };
      var newActor = new actors(data);
      newActor
        .save()
        .then(() => {
          req.flash("success", "Thêm diễn viên thành công!");
          res.redirect("/admin/actor-management/page-1");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Thêm diễn viên không thành công! Có lỗi xảy ra!");
        });
    } else {
      res.redirect("/admin/login");
    }
  }

  // edit actor
  getUpdateActorPage(req, res, next) {
    if (req.isAuthenticated()) {
      var actor_url = req.params.actor_url;
      actors.findOne({ actor_url: actor_url }, (err, actorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            res.render("actor-edit", {
              actor: actorResult,
              admin: adminResult,
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  postUpdateActor(req, res, next) {
    if (req.isAuthenticated()) {
      var actor_url = req.params.actor_url;
      actors.findOne({ actor_url: actor_url }, (err, actorResult) => {
        var data = {
          actor_name: req.body.actor_name,
          actor_description: req.body.actor_description,
        };

        if (req.file) {
          if (actorResult && actorResult.actor_thumbnail) {
            const thumbnailPath = path.join(
              __dirname,
              "../",
              actorResult.actor_thumbnail
            );
            fs.unlink(thumbnailPath, (err) => {
              if (err) {
                console.log(err);
              }
            });

            data.actor_thumbnail = `/${req.file.path}`;
          }
        } else {
          data.actor_thumbnail = actorResult.actor_thumbnail;
        }

        actors
          .findOneAndUpdate({ actor_url: actor_url }, data, { new: true })
          .then(() => {
            req.flash("success", "Cập nhật thông tin diễn viên thành công!");
            res.redirect("/admin/actor-management/page-1");
          })
          .catch((err) => {
            req.flash(
              "error",
              "Cập nhật thông tin diễn viên không thành công! Có lỗi xảy ra!"
            );
            next();
          });
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // remove actor
  getDeleteActorInfo(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      actors.findOneAndRemove({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
          req.flash("error", "Xóa diễn viên không thành công! Có lỗi xảy ra!");
          next();
        }
        if (result && result.actor_thumbnail) {
          const thumbnailPath = path.join(
            __dirname,
            "../",
            result.actor_thumbnail
          );
          fs.unlink(thumbnailPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }

        req.flash("success", "Xóa diễn viên thành công!");
        res.redirect("/admin/actor-management/page-1");
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // Genre manager
  getGenreManagerPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 20;
      genres.find({}, (err, genreResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render("genre-management", {
                message: req.flash("success"),
                page: 1,
                numberItemPerPage: numberItemPerPage,
                admin: adminResult,
                movies: movieResult,
                genres: genreResult,
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  getGenreManagerAtPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 20;
      var page = req.params.page;
      genres.find({}, (err, genreResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render("genre-management", {
                message: req.flash("success"),
                page: page,
                numberItemPerPage: numberItemPerPage,
                admin: adminResult,
                movies: movieResult,
                genres: genreResult,
              });
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // add genre
  getAddGenrePage(req, res, next) {
    if (req.isAuthenticated()) {
      admins.findOne(
        { "loginInformation.username": req.session.passport.user.username },
        (err, adminResult) => {
          res.render("genre-add", {
            admin: adminResult,
          });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postCheckDuplicateGenreURL(req, res, next) {
    var urlName = req.body.genre_url;

    genres.findOne({ genre_url: urlName }, function (err, genre) {
      if (err) {
        res
          .status(500)
          .json({ error: "Đã xảy ra lỗi trong quá trình kiểm tra URL." });
      } else if (genre) {
        res.json({ isDuplicate: true });
      } else {
        res.json({ isDuplicate: false });
      }
    });
  }

  postAddGenre(req, res, next) {
    if (req.isAuthenticated()) {
      var data = {
        genre_url: req.body.genre_url,
        genre_name: req.body.genre_name,
        genre_description: req.body.genre_description,
      };
      var newGenre = new genres(data);
      newGenre
        .save()
        .then(() => {
          req.flash("success", "Thêm thể loại thành công!");
          res.redirect("/admin/genre-management/page-1");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Thêm thể loại không thành công! Có lỗi xảy ra!");
        });
    } else {
      res.redirect("/admin/login");
    }
  }

  // edit genre
  getUpdateGenrePage(req, res, next) {
    if (req.isAuthenticated()) {
      var genre_url = req.params.genre_url;
      genres.findOne({ genre_url: genre_url }, (err, genreResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            res.render("genre-edit", {
              genre: genreResult,
              admin: adminResult,
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  postUpdateGenre(req, res, next) {
    if (req.isAuthenticated()) {
      var genre_url = req.params.genre_url;
      genres.findOne({ genre_url: genre_url }, (err, genreResult) => {
        var data = {
          genre_name: req.body.genre_name,
          genre_description: req.body.genre_description,
        };
        genres
          .findOneAndUpdate({ genre_url: genre_url }, data, { new: true })
          .then(() => {
            req.flash("success", "Cập nhật thông tin thể loại thành công!");
            res.redirect("/admin/genre-management/page-1");
          })
          .catch((err) => {
            req.flash(
              "error",
              "Cập nhật thông tin thể loại không thành công! Có lỗi xảy ra!"
            );
            next();
          });
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // remove genre
  getDeleteGenreInfo(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      genres.findOneAndRemove({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
          req.flash("error", "Xóa thể loại không thành công! Có lỗi xảy ra!");
          next();
        }
        req.flash("success", "Xóa thể loại thành công!");
        res.redirect("/admin/genre-management/page-1");
      });
    } else {
      res.redirect("/admin/login");
    }
  }
}

module.exports = new AdminController();
