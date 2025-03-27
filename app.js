var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

require("./db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var courseRouter = require("./routes/courses");
var studentRouter = require("./routes/students");
var activityRouter = require("./routes/activities");
var eventRouter = require("./routes/events");

var app = express();
const serveIndex = require("serve-index");

// Enable CORS for all origins
app.use(cors());

app.use(
  "/public",
  express.static(path.join(__dirname, "public")),
  serveIndex("public", {
    icons: true,
    view: "details",
  })
);

app.use("/public", express.static("photos"));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", courseRouter);
app.use("/students", studentRouter);
app.use("/activities", activityRouter);
app.use("/events", eventRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
