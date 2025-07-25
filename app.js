const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users-routes");
const placesRouters = require("./routes/places-routes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // we can use (*) as well
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRouters); // => api/places/...
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://<name>:<pw>@cluster0.g6ojsjo.mongodb.net/mern"
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
