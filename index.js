const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");

app.set("view engire", "ejs");
app.use(express.json()); // Parsers
app.use(express.urlencoded({ extend: true })); // Both are used for form handling
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    console.log(files);
  });
  res.render("index.ejs");
});

// app.get("/profile/:username", function (req, res) {
//   req.params.username
//   res.send(`Welcome, ${req.params.username}`);
// });

// app.get("/author/:username/:age", function (req, res) {
//   req.params.username;
//   // res.send(req.params);
//   res.send(`Welcome, ${req.params.username}, ${req.params.age}`)
// });

app.listen(3000, function () {
  console.log("Its Running");
});
