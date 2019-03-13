const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
// DB config
const db = require("./config/keys").mongoURI;

const items = require("./routes/api/items");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
try {
  mongoose.connect(db, { useNewUrlParser: true });
  console.log("MongoDB connected");
} catch (error) {
  console.log(error);
}

app.get("/", (req, res) => {
  res.send("Hello");
});

// Use routes
app.use("/api/items", items);

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
