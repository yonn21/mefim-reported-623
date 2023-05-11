const mongoose = require("mongoose");

const movie = new mongoose.Schema(
  {
    primary_title: String,
    secondary_title: String,
    directors: Array,
    actors: Array,
    genres: Array,
    year: String,
    country: String,
    duration: String,
    type: String,
    languages: String,
    type_sub: Array,
    trailer: String,
    episodes: Array,
    summary: String,
    thumbnail: String,
    cover_image: String,
    rating: Array,
    comment: Array,
    views_week: Number,
    views_month: Number,
    views_year: Number,
    views_all: Number,
  },
  { versionKey: null }
);

module.exports = mongoose.model("movies", movie);
