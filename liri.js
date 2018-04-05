require("dotenv").config();


var keys = require("./keys");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var value = process.argv[3];



// 

switch (command) {
    case "my-tweets":
        showMyTweets();
        break;

    case "spotify-this-song":
        if (value == null) {
            value = "the sign";
        }
        showMySpotify();

        break;

    case "movie-this":
        if (value == null) {
            value = "Mr. Nobody";
        }
        showMyMovie();
        break;

    case "do-what-it-says":
        showMyRandom();
        break;

    default:
        console.log("request not valid");
}


function showMyTweets() {
    var params = { screen_name: 'AndreinalaRein1', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                t = tweets[i];
                console.log(t.text, "|", t.created_at);
            }
        }
    });
}

function showMySpotify() {
    spotify.search({ type: 'track', query: value }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);

        }
        var tracklist = data.tracks.items
        for (var i = 0; i < tracklist.length; i++) {
            t = tracklist[i];
            var a = [];
            for (var j = 0; j < t.artists.length; j++) {
                a.push(t.artists[j].name);
            }
            console.log(a.join(), "|", "\n",
                t.name, "|", "\n",
                t.preview_url, "|", "\n",
                t.album.name, );
        }

        // console.log(data.tracks.items);
    });
}

function showMyMovie() {
    var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            var rtRating = "";
            var Ratings = JSON.parse(body).Ratings;
            for (var i = 0; i < Ratings.length; i++) {
                r = Ratings[i];
                if (r.Source === "Rotten Tomatoes") {
                    rtRating = r.Value;
                }
            }
            console.log(
                "title: " + JSON.parse(body).Title, "\n",
                "year: " + JSON.parse(body).Year, "\n",
                "imbd rating: " + JSON.parse(body).imdbRating, "\n",
                "rotten tomatoes: " + rtRating, "\n",
                "country: " + JSON.parse(body).Country, "\n",
                "language: " + JSON.parse(body).Language, "\n",
                "plot: " + JSON.parse(body).Plot, "\n",
                "actors: " + JSON.parse(body).Actors, "\n",
            );
        }
    });
}

function showMyRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // // We will then print the contents of data
        // console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        // console.log(dataArr);
        command = dataArr[0];
        value = dataArr[1];

        switch (command) {
            case "my-tweets":
                showMyTweets();
                break;
        
            case "spotify-this-song":
                if (value == null) {
                    value = "the sign";
                }
                showMySpotify();
        
                break;
        
            case "movie-this":
                if (value == null) {
                    value = "Mr. Nobody";
                }
                showMyMovie();
                break;
        
            default:
                console.log("request not valid");
        }

    });
}