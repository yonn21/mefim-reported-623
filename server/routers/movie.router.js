const express = require("express");
const passport = require("passport");
const router = express.Router();

const movieController = require("../controllers/movie.controller");

router.get("/tat-ca-phim", movieController.getAllMovie);
router.get("/phim/:url_name", movieController.getMovieByURL);
router.get("/:type_url", movieController.getMovieByType);
router.get("/nam-phat-hanh/:year", movieController.getMovieByYear);
router.get("/quoc-gia/:country", movieController.getMovieByCountry);

router.get("/dao-dien/:director_url", movieController.getMovieByDirector);
router.get("/dien-vien/:actor_url", movieController.getMovieByActor);
router.get("/the-loai/:genre_url", movieController.getMovieByGenre);


module.exports = router;