const mongoose = require("mongoose");

const actor = new mongoose.Schema(
  {
    actor_url: String,
    actor_name: String,
    actor_thumbnail: String,
    actor_description: String,
    actor_movies: Array,
  },
  { versionKey: null }
);

module.exports = mongoose.model("actors", actor);
