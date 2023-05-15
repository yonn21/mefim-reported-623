const express = require("express");
const passport = require("passport");
const router = express.Router();

const movieController = require("../controllers/movie.controller");

router.get("/movie/", movieController.getAllMovie);
//router.get("/:id", movieController.getMovieByID);
router.get("/movie/:url_name", movieController.getMovieByURL);

module.exports = router;
