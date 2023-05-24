const mongoose = require("mongoose");

const genre = new mongoose.Schema(
  {
    genre_url: String,
    genre_name: String,
    genre_movies: Array,
  },
  { versionKey: null }
);

module.exports = mongoose.model("genres", genre);
