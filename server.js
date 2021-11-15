const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const Document = require("./models/documents");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/hastebin-clone", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const code = `# Haste

Sharing code is a good thing, and it should be _really_ easy to do it.
A lot of times, I want to show you something I'm seeing - and that's where we
use pastebins.

Haste is the prettiest, easiest to use pastebin ever made.

## Basic Usage

Type what you want me to see, click "Save", and then copy the URL.  Send that
URL to someone and they'll see what you see.

To make a new entry, click "New" (or type 'control + n')`;

app.get("/", (req, res) => {
  res.render("code-display", { code });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const newDocument = await Document.create({ value });
    res.redirect(`/${newDocument.id}`);
  } catch (error) {
    res.render("new", { value });
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = Document.findById(id);
    res.render("code-display", { code: document });
    console.log(code);
  } catch (error) {
    res.redirect("/");
  }
});

app.listen(3000);
