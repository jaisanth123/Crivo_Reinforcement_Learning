const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.redirect("/server"); // Redirect to FastAPI function
});

module.exports = app;
