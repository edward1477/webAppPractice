const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas.js")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Below "GET" regust could be used to quickly check whether we could connected to the db and create a new instance
// This part is for initial quick testing purpose only
// This part could be deleted after confirmation of proper operation

// app.get("/makecampground", async (req, res) => {
//     const camp = new Campground({ title: "My Backyard", description: "cheap camping" });
//     await camp.save();
//     res.send(camp)
// });


// 1. CRUD operation: Read all elements from the resources
// Create a GET request to the route of "campgrounds" resources
// This is a RESTful CRUD practice to read all items inside this resources
// In this case, all the campground inside the resources campgrounds
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))

// 3. CRUD operation: Create a new element and store in the resources
// step 1. Need a GET request which render a form for user to input data
// step 2. Need a POST request which catch the form inputs and save to DB
router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

router.post("/", validateCampground, catchAsync(async (req, res, next) => {
        
        const campground = new Campground(req.body.campground)
        await campground.save()
        req.flash("success", "Successfully made a new campground!")
        res.redirect(`/campgrounds/${campground._id}`)
}))

// 2. CRUD operation: Read a single elements from the resources
// Create a GET request to the route of a single campground per CRUD operation
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate("reviews")
    if (!campground) {
        req.flash("error", "Campground not found!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })
}))

// 4. CRUD operation: Update a single element in the resources
// step 1. Need a GET request which render a form for user to input data
// step 2. Need a PUT/PATCH request which catch the form inputs and save to DB
router.get("/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("error", "Campground not found!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}))

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        { ...req.body.campground })
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

// 5. CRUD operation: Delete a single element from the resources
router.delete("/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash("success", "Campground deleted successfully!")
    res.redirect("/campgrounds")
}))

module.exports = router;