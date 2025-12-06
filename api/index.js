const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// ROUTES
app.get("/", function (req, res) {
  fs.readdir(path.join(__dirname, "../files"), function (err, files) {
    res.render("index.ejs", { files });
  });
});

app.get("/file/:filename", function (req, res) {
  fs.readFile(
    path.join(__dirname, `../files/${req.params.filename}`),
    "utf-8",
    function (err, filedata) {
      res.render("show.ejs", {
        filename: req.params.filename,
        filedata,
      });
    }
  );
});

app.get("/edit/:filename", function (req, res) {
  res.render("edit.ejs", { filename: req.params.filename });
});

app.post("/create", function (req, res) {
  const fileName = req.body.title.split(" ").join("") + ".txt";

  fs.writeFile(
    path.join(__dirname, `../files/${fileName}`),
    req.body.details,
    function () {
      res.redirect("/");
    }
  );
});

app.post("/edit", function (req, res) {
  fs.rename(
    path.join(__dirname, `../files/${req.body.previous}`),
    path.join(__dirname, `../files/${req.body.new}`),
    function () {
      res.redirect("/");
    }
  );
});

// EXPORT FOR VERCEL
module.exports = app;
module.exports.handler = serverless(app);
