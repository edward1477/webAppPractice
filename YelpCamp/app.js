const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const campground = require("./models/campground");


// 1. Connection to local MongDB database
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// 2. Logic check to ensure connection to the database success or not
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("home");
});


// Below "GET" regust could be used to quickly check whether we could connected to the db and create a new instance
app.get("/makecampground", async (req, res) => {
    const camp = new Campground({ title: "My Backyard", description: "cheap camping" });
    await camp.save();
    res.send(camp)
});


app.listen(3000, () => {
    console.log("Serving on port 3000");
});