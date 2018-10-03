var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//  root route
router.get("/", function(req, res){
    res.render("landing");
});

//  show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//  handle sign up logic
router.post("/register", function (req, res, next) {
    var userInput = new User({
        username: req.body.username
    });
    User.register(userInput, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.name + ": " + err.message);
            return res.redirect("/register");
        }
        console.log("\nUser registered: " + user);

        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/register');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to YelpCamp " + user.username);
                return res.redirect('/campgrounds');
            });
        })(req, res, next);
    });
});

//  show login form
router.get("/login", function (req, res) {
    res.render("login");
});

//  handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}),function (req, res) {

});

//  logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;