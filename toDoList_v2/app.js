//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Create a MongoDB database
//1. Create a connection to the database that we want to use
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

//2. Create a mongoose Schema
const itemsSchema = {
  name: String
};

//3. Creat a mongoose model based on the schema created
const Item = mongoose.model("Item", itemsSchema);
//note: developer use to asign the model name with capital letter
//      the fist parameter pass into model should be a string with capital letter and in singular form
//      mongoose is smart enough to convert that input args into lower case pural form (e.g. Item -> items)

//4. Creat 3 default items inside the collection "items"
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

//5. Put the entries created in step 4 to the database -> items collection using the Item model
//Item.insertMany(defaultItems, function (err) {
//  if (err) {
//    console.log(err);
//  } else {
//    console.log("Successfully saved default items to DB.");
//  }
//});

app.get("/", function (req, res) {
  //Read from a MongoDB database collection
  Item.find({}, function (err, result) {

    if (result.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: result });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully delete the item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:customListName", function (req, res) {

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
