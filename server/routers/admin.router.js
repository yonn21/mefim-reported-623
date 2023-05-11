const express = require("express");
const passport = require("passport");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

const mkdirp = require("mkdirp");
const made = mkdirp.sync(`./public/uploads`);

const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads`);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    cb(null, `${file.originalname}_${timestamp}.${fileExtension}`);
  },
});

const uploadSingle = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb("File type is not allowed", false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});

// Login
router.get("/login", adminController.getLoginPage);
router.post(
  "/login",
  passport.authenticate("admin-local", {
    failureRedirect: "/admin/login",
    successFlash: true,
    failureFlash: true,
  }),
  adminController.getDashboardPage
);

// Logout
router.get("/dashboard/logout", adminController.getLogout);

// Dashboard
router.get("/dashboard", adminController.getDashboardPage);

// Movie manager
router.get("/movie-management/page-1", adminController.getMovieManagerPage);
router.get(
  "/movie-management/page-:page",
  adminController.getMovieManagerAtPage
);
// router.post(
//   "/movie-management/add",
//   uploadSingle.single("movie_thumbnail"),
//   adminController.postAddMovie
// );
// router.get("/movie-management/add", adminController.getAddMoviePage);
// router.post(
//   "/movie-management/edit/:id",
//   uploadSingle.single("movie_thumbnail"),
//   adminController.postUpdateMoviePage
// );
// router.get("/movie-management/edit/:id", adminController.getUpdateMoviePage);
router.get("/movie-management/remove/:id", adminController.getDeleteMovieInfo);

// Director manager
router.get(
  "/director-management/page-1",
  adminController.getDirectorManagerPage
);
router.get(
  "/director-management/page-:page",
  adminController.getDirectorManagerAtPage
);
router.post(
  "/director-management/add",
  uploadSingle.single("director_thumbnail"),
  adminController.postAddDirector
);
router.get("/director-management/add", adminController.getAddDirectorPage);
router.post(
  "/director-management/edit/:id",
  uploadSingle.single("director_thumbnail"),
  adminController.postUpdateDirectorPage
);
router.get(
  "/director-management/edit/:id",
  adminController.getUpdateDirectorPage
);
router.get(
  "/director-management/remove/:id",
  adminController.getDeleteDirectorInfo
);

// Actor manager
router.get("/actor-management/page-1", adminController.getActorManagerPage);
router.get(
  "/actor-management/page-:page",
  adminController.getActorManagerAtPage
);
router.post(
  "/actor-management/add",
  uploadSingle.single("actor_thumbnail"),
  adminController.postAddActor
);
router.get("/actor-management/add", adminController.getAddActorPage);
router.post(
  "/actor-management/edit/:id",
  uploadSingle.single("actor_thumbnail"),
  adminController.postUpdateActorPage
);
router.get("/actor-management/edit/:id", adminController.getUpdateActorPage);
router.get("/actor-management/remove/:id", adminController.getDeleteActorInfo);

// Genre manager
router.get("/genre-management/page-1", adminController.getGenreManagerPage);
router.get(
  "/genre-management/page-:page",
  adminController.getGenreManagerAtPage
);
router.post("/genre-management/add", adminController.postAddGenre);
router.get("/genre-management/add", adminController.getAddGenrePage);
router.post("/genre-management/edit/:id", adminController.postUpdateGenrePage);
router.get("/genre-management/edit/:id", adminController.getUpdateGenrePage);
router.get("/genre-management/remove/:id", adminController.getDeleteGenreInfo);

module.exports = router;
