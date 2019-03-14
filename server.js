const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const config = require("config");

const items = require("./routes/api/items");
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Config
const db = config.get("mongoURI");

// Connect to DB
try {
  mongoose.connect(db || process.env.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
  console.log("MongoDB connected");
} catch (error) {
  console.log(error);
}

// Use routes
app.use("/api/items", items);
app.use("/api/users", users);
app.use("/api/auth", auth);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port ${port}`);
