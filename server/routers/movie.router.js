const express = require("express");
const passport = require("passport");
const router = express.Router();

const movieController = require("../controllers/movie.controller");

router.get("/tat-ca-phim", movieController.getAllMovie);
//router.get("/:id", movieController.getMovieByID);
router.get("/phim/:url_name", movieController.getMovieByURL);

module.exports = router;