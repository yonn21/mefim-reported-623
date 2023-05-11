const express = require("express");
const passport = require("passport");
const router = express.Router();

const movieController = require("../controllers/movie.controller");

router.get("/", movieController.getAllMovie);
//router.get("/:id", movieController.getMovieByID);
router.get("/:url_name", movieController.getMovieByTitle);

module.exports = router;
