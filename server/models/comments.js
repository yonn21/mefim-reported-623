const mongoose = require("mongoose");

const comment = new mongoose.Schema(
  {
    comment_content: String,
    comment_user: String,
    comment_movie: String,
    comment_date: Date,
  },
  { versionKey: null }
);

module.exports = mongoose.model("comments", comment);
