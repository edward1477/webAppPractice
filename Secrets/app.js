//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//1. Connection to local MongDB database
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

//2. Create the dataBase collection's schema
// If encryption is implemetned, we need to use official mongoose schema object
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//3. In order to use mongoose-encryption, we need to create a varible to store a user defined secret string and enable the plug-in
//const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


//4. Create the corresponding mongoose model to handle this collection
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

// Handle POST request of new user registration
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

// Handle POST request of existing user login
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});