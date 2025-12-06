const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const fs = require("fs");

const app = express();

// Correct view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/public", express.static(path.join(__dirname, "../public")));

// HOME PAGE
app.get("/", (req, res) => {
  const filesPath = path.join(__dirname, "../files");

  fs.readdir(filesPath, (err, files) => {
    if (err) {
      console.error("FS ERROR (readdir):", err);
      return res.status(500).send("Error reading files folder.");
    }

    res.render("index.ejs", { files });
  });
});

// VIEW FILE
app.get("/file/:filename", (req, res) => {
  const filePath = path.join(__dirname, `../files/${req.params.filename}`);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err || !data) {
      console.error("FS ERROR (readFile):", err);
      return res.status(500).send("Error reading file.");
    }

    res.render("show.ejs", {
      filename: req.params.filename,
      filedata: data,
    });
  });
});

// EDIT PAGE
app.get("/edit/:filename", (req, res) => {
  res.render("edit.ejs", { filename: req.params.filename });
});

// CREATE FILE
app.post("/create", (req, res) => {
  const filename = req.body.title.split(" ").join("") + ".txt";
  const filePath = path.join(__dirname, `../files/${filename}`);

  fs.writeFile(filePath, req.body.details, (err) => {
    if (err) {
      console.error("FS ERROR (writeFile):", err);
      return res.status(500).send("Cannot create file.");
    }
    res.redirect("/");
  });
});

// RENAME FILE
app.post("/edit", (req, res) => {
  const oldPath = path.join(__dirname, `../files/${req.body.previous}`);
  const newPath = path.join(__dirname, `../files/${req.body.new}`);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("FS ERROR (rename):", err);
      return res.status(500).send("Failed to rename file.");
    }
    res.redirect("/");
  });
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
