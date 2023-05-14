const mongoose = require("mongoose");

const movie = new mongoose.Schema(
  {
    url_name: String,
    primary_title: String,
    secondary_title: String,
    directors: Array,
    actors: Array,
    genres: Array,
    year: String,
    country: String,
    duration: String,
    type: String,
    type_url: String,
    type_sub: Array,
    trailer: String,
    episodes: Array,
    summary: String,
    thumbnail: String,
    cover_image: String,
    rating: Array,
    comment: Array,
    views_3days: Number,
    views_week: Number,
    views_month: Number,
    views_year: Number,
    views_all: Number,
    number_favourited: Number,
  },
  { versionKey: null }
);

module.exports = mongoose.model("movies", movie);
