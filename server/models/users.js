const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    loginInformation: Object,
    user_email: String,
    user_phoneNumber: String,
    user_avatar: String,
    user_displayName: String,
    user_gender: String,
    user_favoriteMovies: Array,
    user_purchasedMovies: Array,
    user_watchedMovies: Array,
    user_rating: Array,
    user_comment: Array,
    user_currentBalance: Number,
    user_vipLevel: Number,
    user_vipExpiryDate: Date,
  },
  { versionKey: null }
);

module.exports = mongoose.model("users", user);
