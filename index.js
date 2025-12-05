const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");

app.set("view engire", "ejs");
app.use(express.json()); // Parsers
app.use(express.urlencoded({ extend: true })); // Both are used for form handling
app.use(express.static(path.join(__dirname, "public")));

app.get(`/`, function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    console.log(files);
    res.render("index.ejs", { files: files });
  });
});

app.get(`/file/:filename`, function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata, title) {
      console.log(filedata);
      res.render("show.ejs", {
        filename: req.params.filename,
        title: title,
        filedata: filedata,
      });
    }
  );
});

app.get(`/edit/:filename`, function (req, res) {
  res.render(`edit.ejs`, { filename: req.params.filename });
});

app.post(`/create`, function (req, res) {
  console.log(req.body);
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/");
    }
  );
});

app.post(`/edit`, function (req, res) {
  console.log(req.body);
  fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`, function(err) {
      res.redirect("/");
    }
  );
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
