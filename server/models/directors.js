const mongoose = require("mongoose");

const director = new mongoose.Schema(
  {
    director_url: String,
    director_name: String,
    director_thumbnail: String,
    director_description: String,
    director_movies: Array,
  },
  { versionKey: null }
);

module.exports = mongoose.model("directors", director);
