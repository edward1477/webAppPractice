// The seed folder is nothing to do with the main application,
// It just connect to MongoDB and create some campGround input data to it for our app to use
// It is not needed in real world application but just for demo or development purpose
// It also servce as a quick way to view status of the MongoDB if anything we changes

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers")


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

// Define a function
const sample = array => array[Math.floor(Math.random() * array.length)]

// Define a function "seedDB" as function expression
const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,    
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio pariatur dolorum voluptatibus, ea, minima quidem eius dolorem dicta est fuga nulla rem minus vero explicabo praesentium ad doloremque tenetur sapiente?",
            price
        })
        await camp.save()
    }
}

// Executing the function by calling it
seedDB().then(() => {
    mongoose.connection.close()
})