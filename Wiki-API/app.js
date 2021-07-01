const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// Middlewares section
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB databse setup
//1. Create a connection to the targeted DB: wikiDB
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

//2. Create a DB schema variable (This is the collection of the connected DB)
const articleSchema = {
    title: String,
    content: String
};

//3. Create a mongoose mode based on the schema created
const Article = mongoose.model("Article", articleSchema);

//RESTful implementations
//1. GET request to the collections (articles), fetches ALL the articles
app.get("/articles", function (req, res) {
    Article.find({}, function (err, foundArticles) {
        if (!err) {
            //console.log(foundArticles); use this to test for our code in first glance
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

//2. POST request to the collections (articles), add one new articles to the collections
app.post("/articles", function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function (err) {
        if (!err) {
            res.send("Sucessfully added a new article.");
        } else {
            res.send(err);
        }
    });
});

//Start and continue monitoring the port for any incoming request
app.listen(3000, function () {
    console.log("Server started on port 3000.");
});