const mongoose = require("mongoose");

const admin = new mongoose.Schema(
  {
    loginInformation: Object,
    admin_email: String,
    admin_phoneNumber: String,
    admin_avatar: String,
    admin_level: Number,
  },
  { versionKey: null }
);

module.exports = mongoose.model("admins", admin);
