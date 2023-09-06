const express = require("express");
const app = express();
app.set("view engine", "ejs"); //view engine is going to be ejs
app.use(express.static("public")); //In the public folder all files are static we want to serve
//app.use(express.urlencoded({ extended: true }));

const Document = require("./models/Documents");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pastebin", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  const code = `Welcome to pastebin!

Use the commands on the top right corner 
to create anew file to share with others.`;
  res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (e) {
    res.render("new", { value });
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("new", { code: document.value });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("code-display", { code: document.value, id });
  } catch (e) {
    res.redirect("/");
  }
});

app.listen(3000);
