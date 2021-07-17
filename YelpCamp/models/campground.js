const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//2. Create the dataBase collection's schema
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model("Campground", CampgroundSchema);