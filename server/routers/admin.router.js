const express = require("express");
const passport = require("passport");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

// create folder if not exists
const mkdirp = require("mkdirp");
const made = mkdirp.sync(`./public/uploads`);
const madeActor = mkdirp.sync(`./public/uploads/actors`);
const madeDirector = mkdirp.sync(`./public/uploads/directors`);
const madeMovie = mkdirp.sync(`./public/uploads/movies`);
const madeAdmin = mkdirp.sync(`./public/uploads/admins`);
const madeUser = mkdirp.sync(`./public/uploads/users`);

const multer = require("multer");
const moment = require("moment");

// create function upload image
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

const actorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/actors`);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    cb(null, `${file.originalname}_${timestamp}.${fileExtension}`);
  },
});

const uploadActor = multer({
  storage: actorStorage,
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

const directorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/directors`);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    cb(null, `${file.originalname}_${timestamp}.${fileExtension}`);
  },
});

const uploadDirector = multer({
  storage: directorStorage,
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

const movieStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/movies`);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    cb(null, `${file.originalname}_${timestamp}.${fileExtension}`);
  },
});

const uploadMovie = multer({
  storage: movieStorage,
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
// add movie
router.post("/check-duplicate-movie-url", adminController.postCheckDuplicateMovieURL);
router.post(
  "/movie-management/add",
  uploadMovie.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  adminController.postAddMovie
);
router.get("/movie-management/add", adminController.getAddMoviePage);
// edit movie
router.post(
  "/movie-management/edit/:id",
  uploadMovie.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  adminController.postUpdateMovie
);
router.get("/movie-management/edit/:id", adminController.getUpdateMoviePage);
// remove movie
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
// add director
router.post("/check-duplicate-director-url", adminController.postCheckDuplicateDirectorURL);
router.post(
  "/director-management/add",
  uploadDirector.single("director_thumbnail"),
  adminController.postAddDirector
);
router.get("/director-management/add", adminController.getAddDirectorPage);
// edit director
router.post(
  "/director-management/edit/:id",
  uploadDirector.single("director_thumbnail"),
  adminController.postUpdateDirector
);
router.get(
  "/director-management/edit/:id",
  adminController.getUpdateDirectorPage
);
// remove director
router.get(
  "/director-management/remove/:id",
  adminController.getDeleteDirectorInfo
);

// Actor manager
router.post("/check-duplicate-actor-url", adminController.postCheckDuplicateActorURL);
router.get("/actor-management/page-1", adminController.getActorManagerPage);
router.get(
  "/actor-management/page-:page",
  adminController.getActorManagerAtPage
);
// add actor
router.post(
  "/actor-management/add",
  uploadActor.single("actor_thumbnail"),
  adminController.postAddActor
);
router.get("/actor-management/add", adminController.getAddActorPage);
// edit actor
router.post(
  "/actor-management/edit/:id",
  uploadActor.single("actor_thumbnail"),
  adminController.postUpdateActor
);
router.get("/actor-management/edit/:id", adminController.getUpdateActorPage);
// remove actor
router.get("/actor-management/remove/:id", adminController.getDeleteActorInfo);

// Genre manager
router.get("/genre-management/page-1", adminController.getGenreManagerPage);
router.get(
  "/genre-management/page-:page",
  adminController.getGenreManagerAtPage
);
// add genre
router.post("/check-duplicate-genre-url", adminController.postCheckDuplicateGenreURL);
router.post("/genre-management/add", adminController.postAddGenre);
router.get("/genre-management/add", adminController.getAddGenrePage);
// edit genre
router.post("/genre-management/edit/:id", adminController.postUpdateGenre);
router.get("/genre-management/edit/:id", adminController.getUpdateGenrePage);
// remove genre
router.get("/genre-management/remove/:id", adminController.getDeleteGenreInfo);

module.exports = router;
