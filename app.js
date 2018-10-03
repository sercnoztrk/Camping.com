var express         = require("express"),
    app             = express(),
    session         = require("express-session"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");
    User            = require("./models/user"),
    seedDB          = require("./seed");

//  Requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();     Seed the database

//  PASSPORT CONFIGURATION
app.use(session({
    secret: "YelpCamp all the way!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.loggedUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//  ROUTES CONFIG
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

app.listen(3000, function(){
    console.log("The server has started...");
});