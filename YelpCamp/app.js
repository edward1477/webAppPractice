const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

// Employing Middleware that will be used in this app.
app.engine("ejs", ejsMate)

// Set up to use templating for different pages
// We need to store all ejs file in a folder called "views"
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up parser to parse the body of html request incoming
// Another modules call body-parser could be used also but not in this app. 
app.use(express.urlencoded({ extended: true }))

// Set up method override for put/patch/delete request which is not
// a method in html form (i.e. html form element only have GET and POST request method)
app.use(methodOverride("_method"))

// Set up the app to use resources from static directory, e.g. public
app.use(express.static(path.join(__dirname, "public")))

// Set up to use session in our app
const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

// Using the router for different routes
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)

// Section of various routes and requests' definitions
app.get("/", (req, res) => {
    res.render("home");
});

// Error handling section:
// This is to catch any of request with improper URL specified that is 
// not match all of routes defined above, this code must be placed after all
// valid routes defined in your application
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

// Express basic error handler to catch errors at server side
app.use((err, req, res, next) => {
    // Default value of statusCode = 500 and message = "Something went wrong"
    // if nothing is passed to it as err
    const { statusCode=500 } = err
    if (!err.message) err.message = "Something Went Wrong!!!"
    res.status(statusCode).render("error", { err })
})

// Starting up of the server
app.listen(3000, () => {
    console.log("Serving on port 3000");
});