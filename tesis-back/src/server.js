const express = require("express");

const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

let router = require("./router");
const config = require("../config");

let app = express();

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));

/**
 * Disable
 */
app.disable('x-powered-by');

/**
 * Cors config
 */
app.use(cors());

/**
 * Upload files
 */
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  createParentPath: true
}));

/**
 * Public folder
 */
app.use("/images", express.static(path.join(__dirname, "./public/images")));

/**
 * Routers
 */
app.use(config.api.prefix, router);

/**
 * Errors
 */
app.use(function (req, res, next) {
  next({ error: "error" });
});

app.use(function (err, req, res, next) {
  console.log("err", err);
  return res.status(404).json({ status: false, message: "Page Not found", data: {} })
});

/**
 * Mongoose
 */
mongoose.connect(config.mongo_uri);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

module.exports = app;