var express = require("express");
var router  = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function (req, res) {    
    Campground.find({}, function(err, campground){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var name    = req.body.nameInput;
    var image   = req.body.imageInput;
    var price   = req.body.priceInput;
    var desc    = req.body.descriptionInput;
    var author  = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    }, function (err, newCampground) {
        if(err){
            console.log(err);             
        }
        else {
            console.log("\nNew campground has posted: " + newCampground);
            res.redirect("/campgrounds"); 
        }
    });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
        } else if (!foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {foundCampground: foundCampground});
        }
    });
});

//  Edit 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//  Update
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//  Delete
router.delete("/:id", middleware.checkCampgroundOwnership,function (req, res) {
    Campground.findOneAndRemove({_id: req.params.id}, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            console.log("\nCampground removed...");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;