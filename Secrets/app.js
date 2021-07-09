//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// level 2: Encryption
//const encrypt = require("mongoose-encryption"); 
//Not use encryption when we turn to use Hash

// Level 3: Hash function
//const md5 = require("md5");

// Level 4: Hash & Salt and using bcrypt npm module instead of MD5
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

//Level 2: Encryption
// ***Place this kind of secret information in environment variable .env file
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
//Not use encryption when we turn to use Hash

// Level 3: Hash function



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

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

// Handle POST request of existing user login
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    //const password = md5(req.body.password);

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result == true) {
                        res.render("secrets");
                    }
                });



            }
        }
    });
});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});