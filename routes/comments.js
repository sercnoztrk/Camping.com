var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");


//  Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//  Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            console.log("\n" + foundCampground);
            Comment.create(req.body.commentInput, function (err, newComment) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                }
                else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//  Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else if (!foundComment) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//  Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.commentInput, function (err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//  Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findOneAndRemove({_id: req.params.comment_id}, function (err, deletedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log("\nComment deleted: " + deletedComment);
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;