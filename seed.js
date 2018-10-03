var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");


var data = [
    {
        name: "Cloud's Rest",
        image: "http://goingtogetlost.com/wp-content/uploads/2016/07/clouds-rest-15-1280x897.jpg",
        description: "We left Sunrise Lakes at about 2 or 3pm and headed back to the sign juncture to continue on the Cloud’s Rest path. This is actually the easiest part of the hike and only the end is a bit steep but not nearly as much of a sweat as the first part of the hike with the switchbacks. About half a mile from the top on the right, you will see this beautiful view. Be sure not to miss it!"
    },
    {
        name: "Desert Mesa",
        image: "https://img.hipcamp.com/images/c_limit,f_auto,h_1200,q_60,w_1920/v1516386592/campground-photos/ejjgdlih96s9z9jcnrp9/crystal-mesa-campground.jpg",
        description: "As the crow flies, 3 miles west of the Terlingua Ghost Town, this well maintained and slightly manicured strip of desert nestled behind the ghost town offers 24 acres of unobstructed views of the Big Bend National Park. Enjoy quiet serenity and easy access to local area attractions."
    },
    {
        name: "Canyon Floor",
        image: "https://jameskaiser.com/wp-content/uploads/2016/07/grand-canyon-river-trip-camping.jpg",
        description: "Nothing — and I mean nothing — reveals the beauty of Grand Canyon like a Grand Canyon River Trip. In addition to thrilling rapids and spectacular hiking, you’ll camp out on the banks of the Colorado River every night. Most campsites are located on beautiful, sandy beaches. As you fall asleep to the sound of the Colorado slowly carving Grand Canyon, billions of stars blaze overhead. There’s no better way to lose yourself—and find yourself."
    }
]


function seedDB() { 
    Campground.deleteMany(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Campgrounds removed!");
        }
        data.forEach(seed => {
            Campground.create(seed, function (err, newCampground) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Campground added!");
                }
                Comment.create({
                    text: "This place is great, but i wish there was internet.",
                    author: "Homer"
                }, function (err, newComment) {
                    newCampground.comments.push(newComment);
                    newCampground.save();
                    console.log("Comment added!");
                });
            });
        });
    });
}

module.exports = seedDB;