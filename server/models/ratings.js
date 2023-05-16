const mongoose = require("mongoose");

const rating = new mongoose.Schema(
  {
    rating_value: Number,
    rating_users: Array,
    rating_movies: Array,
    rating_date: Date,
  },
  { versionKey: null }
);

module.exports = mongoose.model("ratings", rating);
