const express = require("express");
const app = express();
const path = require("path");

// Passport config
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const adminModel = require("./models/admins");
const userModel = require("./models/users");

app.use(
  session({
    secret: "abcdefgh0912mefim873465zxc",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: Infinity,
      path: "/admin",
    },
  })
);
app.use(
  session({
    secret: "abcdefgh0912873465zxc",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: Infinity,
      path: "/",
    },
  })
);

app.use(flash());

passport.use(
  "admin-local",
  new LocalStrategy(function (username, password, done) {
    adminModel.findOne(
      { "loginInformation.username": username },
      function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Sai rồi!",
          });
        }
        if (user.loginInformation.password !== password) {
          return done(null, false, {
            message: "Sai rồi!",
          });
        }
        return done(null, user, { message: "Đăng nhập thành công!" });
      }
    );
  })
);
passport.use(
  "user-local",
  new LocalStrategy(function (username, password, done) {
    userModel.findOne(
      { "loginInformation.username": username },
      function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Không tìm thấy tên người dùng!",
          });
        }
        if (user.loginInformation.password !== password) {
          return done(null, false, {
            message: "Sai tên người dùng hoặc mật khẩu!",
          });
        }
        return done(null, user, { message: "Đăng nhập thành công!" });
      }
    );
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  return done(null, {
    username: user.loginInformation.username,
    type: user.loginInformation.type,
  });
});
passport.deserializeUser((user, done) => {
  if (user.type == "admin") {
    adminModel.findOne(
      { "loginInformation.username": user.username },
      (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);
        if (result.loginInformation.username == user.username) {
          return done(null, result);
        }
      }
    );
  } else {
    userModel.findOne(
      { "loginInformation.username": user.username },
      (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);
        if (result.loginInformation.username == user.username) {
          return done(null, result);
        }
      }
    );
  }
});

// Mongoose connect
mongoose
  .connect("mongodb://127.0.0.1/mefims", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.set("useFindAndModify", false);
mongoose.connection.on("error", (err) => {
  console.log(err);
});

// View engine
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/")));

// Route config
const admin = require("./routers/admin.router");
const movie = require("./routers/movie.router");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", movie);
app.use("/admin", admin);

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server is started at: http://localhost:${PORT}`);
});

module.exports = app;
