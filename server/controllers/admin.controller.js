const path = require("path");
const view_path = path.join(__dirname, "../views");

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
    res.render(path.join(view_path, "login"), { message: req.flash("error") });
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
            res.render(path.join(view_path, "dashboard"), {
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
  // getMovieManagerPage(req, res, next) {
  //     if (req.isAuthenticated()) {
  //         var numberItemPerPage = 12
  //         movies.find({}, (err, movieResult) => {
  //             admins.findOne(
  //                 { 'loginInformation.username': req.session.passport.user.username },
  //                 (err, adminResult) => {
  //                     directors.find({}, (err, directorResult) => {
  //                         actors.find({}, (err, actorResult) => {
  //                             genres.find({}, (err, genreResult) => {
  //                                 ratings.find({}, (err, ratingResult) => {
  //                                     comments.find({}, (err, commentResult) => {
  //                                         res.render('quan-ly-phim', {
  //                                             message: req.flash('success'),
  //                                             page: 1,
  //                                             numberItemPerPage: numberItemPerPage,
  //                                             admin: adminResult,
  //                                             movies: movieResult,
  //                                             directors: directorResult,
  //                                             actors: actorResult,
  //                                             genres: genreResult,
  //                                             ratings: ratingResult,
  //                                             comments: commentResult,
  //                                         })
  //                                     })
  //                                 })
  //                             })
  //                         })
  //                     })
  //                 }
  //             )
  //         })
  //     } else {
  //         res.redirect('/admin/login')
  //     }
  // }

  // getMovieManagerAtPage(req, res, next) {
  //     if (req.isAuthenticated()) {
  //         var numberItemPerPage = 12
  //         var page = req.params.page
  //         movies.find({}, (err, movieResult) => {
  //             admins.findOne(
  //                 { 'loginInformation.username': req.session.passport.user.username },
  //                 (err, adminResult) => {
  //                     directors.find({}, (err, directorResult) => {
  //                         actors.find({}, (err, actorResult) => {
  //                             genres.find({}, (err, genreResult) => {
  //                                 ratings.find({}, (err, ratingResult) => {
  //                                     comments.find({}, (err, commentResult) => {
  //                                         res.render('quan-ly-phim', {
  //                                             message: req.flash('success'),
  //                                             page: page,
  //                                             numberItemPerPage: numberItemPerPage,
  //                                             admin: adminResult,
  //                                             movies: movieResult,
  //                                             directors: directorResult,
  //                                             actors: actorResult,
  //                                             genres: genreResult,
  //                                             ratings: ratingResult,
  //                                             comments: commentResult,
  //                                         })
  //                                     })
  //                                 })
  //                             })
  //                         })
  //                     })
  //                 }
  //             )
  //         })
  //     } else {
  //         res.redirect('/admin/login')
  //     }
  // }

  // Director manager
  getDirectorManagerPage(req, res, next) {
    if (req.isAuthenticated()) {
      var numberItemPerPage = 10;
      directors.find({}, (err, directorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            movies.find({}, (err, movieResult) => {
              res.render(path.join(view_path, "director-management"), {
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

  getAddDirectorPage(req, res, next) {
    if (req.isAuthenticated()) {
      admins.findOne(
        { "loginInformation.username": req.session.passport.user.username },
        (err, adminResult) => {
          res.render(path.join(view_path, "director-add"), {
            admin: adminResult,
          });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postAddDirector(req, res, next) {
    if (req.isAuthenticated()) {
      var data = {
        director_name: req.body.director_name,
        director_thumbnail: `/${req.file.path}`,
        director_description: req.body.director_description,
        status: true,
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

  getUpdateDirectorPage(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      directors.findOne({ _id: id }, (err, directorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            res.render(path.join(view_path, "director-edit"), {
              director: directorResult,
              admin: adminResult,
            });
          }
        );
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  postUpdateDirectorPage(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      directors.findOne({ _id: id }, (err, directorResult) => {
        var data = {
          director_name: req.body.director_name,
          director_thumbnail: req.file
            ? `/${req.file.path}`
            : directorResult.director_thumbnail,
          director_description: req.body.director_description,
        };
        directors
          .findOneAndUpdate({ _id: id }, data, { new: true })
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
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  getDeleteDirectorInfo(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      directors.findOneAndRemove({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
          req.flash("error", "Xóa đạo diễn không thành công! Có lỗi xảy ra!");
          next();
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
              res.render(path.join(view_path, "actor-management"), {
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

  getAddActorPage(req, res, next) {
    if (req.isAuthenticated()) {
      admins.findOne(
        { "loginInformation.username": req.session.passport.user.username },
        (err, adminResult) => {
          res.render(path.join(view_path, "actor-add"), {
            admin: adminResult,
          });
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  }

  postAddActor(req, res, next) {
    if (req.isAuthenticated()) {
      var data = {
        actor_name: req.body.actor_name,
        actor_thumbnail: `/${req.file.path}`,
        actor_description: req.body.actor_description,
        status: true,
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

  getUpdateActorPage(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      actors.findOne({ _id: id }, (err, actorResult) => {
        admins.findOne(
          { "loginInformation.username": req.session.passport.user.username },
          (err, adminResult) => {
            res.render(path.join(view_path, "actor-edit"), {
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

  postUpdateActorPage(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      actors.findOne({ _id: id }, (err, actorResult) => {
        var data = {
          actor_name: req.body.actor_name,
          actor_thumbnail: req.file
            ? `/${req.file.path}`
            : actorResult.actor_thumbnail,
          actor_description: req.body.actor_description,
        };
        actors
          .findOneAndUpdate({ _id: id }, data, { new: true })
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

  getDeleteActorInfo(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      actors.findOneAndRemove({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
          req.flash("error", "Xóa diễn viên không thành công! Có lỗi xảy ra!");
          next();
        }
        req.flash("success", "Xóa diễn viên thành công!");
        res.redirect("/admin/actor-management/page-1");
      });
    } else {
      res.redirect("/admin/login");
    }
  }
}

module.exports = new AdminController();
