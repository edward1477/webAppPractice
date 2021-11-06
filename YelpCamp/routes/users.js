const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");


// 1. Create the register route and logic
// Step 1. GET request to render the register form page
router.get("/register", (req, res) => {
    res.render("users/register");
});

// Step. 2 POST request to handle logic with data submit from the form
router.post("/register", catchAsync (async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User ({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Yelp Camp!")
            res.redirect("/campgrounds")
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}));

// 2. Create the login route and logic
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

// 3. Create the logout route and logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!")
    res.redirect("/campgrounds");
})

module.exports = router;