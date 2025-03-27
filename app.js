var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

require("./db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var courseRouter = require('./routes/courses')
var studentRouter = require("./routes/students")
var activityRouter = require("./routes/activities")
var eventRouter = require("./routes/events")

var app = express();
const serveIndex = require("serve-index");


let allowedOrigins = [
  "http://localhost:3000",
  "https://eventify-frontend-rho.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(
  "/public",
  express.static(path.join(__dirname, "public")),
  serveIndex("public", {
    icons: true,
    view: "details",
  })
);



app.use("/public", express.static("photos"));


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", courseRouter)
app.use("/students", studentRouter)
app.use('/activities', activityRouter)
app.use('/events', eventRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
