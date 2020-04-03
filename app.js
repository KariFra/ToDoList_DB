const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");



const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("static"));
// bardzo ważne gdy używamy ejs
app.set("view engine", "ejs");

mongoose.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    //tworze schema
const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to the world of planning"
});
const item2 = new Item({
    name: "Hit the + button to add next task"
});
const item3 = new Item({
    name: "Check to delete"
});

const defaultItems = [item1, item2, item3];
//tworze kolejna schema
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {

    Item.find({}, function(err, foundList) {
        if (foundList.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/");
                }
            });
        } else if (err) {
            console.log(err);
        } else {
            const day = date.getDate();

            res.render("list", {
                listTitle: day,
                newListItems: foundList
            });
        }
    });


});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.button;
    const day = date.getDate();

    console.log(listName);

    const item = new Item({
        name: itemName
    });

    if (listName === day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, result) {
            result.items.push(item);
            result.save();
            res.redirect("/" + listName);
        })
    }


});
app.post("/delete", function(req, res) {
    const chckedItemId = req.body.checkbox;
    const listName = req.body.listName;
    const day = date.getDate();

    if (listName === day) {
        Item.findByIdAndRemove(chckedItemId, function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: chckedItemId } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function(err, result) {
        if (!err) {
            if (!result) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);

            } else {
                res.render("list", {
                    listTitle: result.name,
                    newListItems: result.items
                });
            }
        }

    });

});

app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function() {
    console.log("Server is set up on port 3000");
});