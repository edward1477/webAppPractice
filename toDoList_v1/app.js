//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const items = ["Buy Food", "Cook Food", "Eat Food"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

  let day = date.getDate();

  res.render("list", { day: day, items: items });

});

app.post("/", function (req, res) {

  var item = req.body.newItem
  items.push(item);
  res.redirect("/");

});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
