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

////////////////////////////////// Request Targeting all Ariticles //////////////////////////

//RESTful implementations using chain route method 
app.route("/articles")

    //1. GET request to the collections (articles), fetches ALL the articles
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                //console.log(foundArticles); use this to test for our code in first glance
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    //2. POST request to the collections (articles), add one new articles to the collections
    .post(function (req, res) {
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
    })

    //3. DELETE request to the collections (articles), add one new articles to the collections
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Sucessfully deleted all articles.")
            } else {
                res.send(err);
            }
        });
    });

////////////////////////////////// Request Targeting a specified Ariticles //////////////////////////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })

    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err, results) {
                if (!err) {
                    res.send("Sucessfully updated article.");
                } else {
                    res.send(err);
                }
            });
    })

    .patch(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (req, res) {
                if (!err) {
                    res.send("Sucessfully update article.");
                } else {
                    res.send(err);
                }
            });
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (req, res) {
                if (!err) {
                    res.send("Sucessfully deleted articles.");
                } else {
                    res.send(err);
                }
            });
    });



//Start and continue monitoring the port for any incoming request
app.listen(3000, function () {
    console.log("Server started on port 3000.");
});