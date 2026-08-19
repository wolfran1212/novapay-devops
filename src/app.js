const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    application: "NovaPay API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/test", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

module.exports = app;