
// code to read and set any environment variables with the dotenv package
require('dotenv').config();
// import axios
var axios = require("axios");

var movieName = 'jaws';
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
// test axios - this just a test and will need to be addressed and moved to the correct part of my program
/* we need

* Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
*/

/*
console.log(queryUrl);

axios.get(queryUrl).then(
    function(response) {
        for (var key in response.data) {
            // print each key value pair in object
            console.log(response.data[key]);
        }
        // print the object
        console.log(JSON.stringify(response.data));
    }
);

*/

// test bands in town
/* We need:
    Name of the venue
    Venue location
    Date of the Event (use moment to format this as "MM/DD/YYYY") - use Moment
*/  
var artist = 'foo fighters';
axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then( 
    function(response) {
        /* 
            the response object is one large object consisting of numeric keys who's
            value pair is an object consisting of sub-objects
        */

        // iterate through the returned response object and get the value of each key/value pair and capture it
        for (var key in response.data) {
            //console.log(key+' : '+ JSON.stringify(response.data[key]));
            var value = response.data[key];

            // capture the sub-objects within each returned value
            for ( var subkey in value) {
                // console.log(subkey+ ' : ' + value[subkey]);
                // find the venue sub-sub-object
                if (subkey === 'venue') {
                    console.log(subkey);
                }
            }
        } 
    }
);


// import keys
var keys = require('./keys.js'); 

// trying to create an objecy but where is the constructor? Spotify is not a constructor...
// I think we need to create a constructor and pass it keys
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new

function Spotify(auth) {
    this.auth = auth;
}

// this is from instructions example, I am not sure if I need this yet
var spotify = new Spotify(keys.spotify);
console.log('spotify object is ', spotify);

// how to use spotify with promise or without I will test both
// https://www.npmjs.com/package/node-spotify-api

// test for command line args
var nodeArgs = process.argv;

// declare string as empty else get an 'undefined' as first element in array
var userInput = '';

/* 
    Guardian Statement
    Check if index[2] is empty or a parameter other than expected
*/
if (!nodeArgs[2] || nodeArgs[2] !== 'concert-this' || nodeArgs[2] !== 'spotify-this-song' 
                 || nodeArgs[2] !== 'movie-this' || nodeArgs[2] !== 'do-what-it-says') {
    // useage statement
    console.log('SCRIPT USAGE: \n' +
        'concert-this <band name> \n' +
        'spotify-this-song <song name> \n' +
        'movie-this <movie name> \n' +
        'do-what-it-says \n');
}

// inspect nodeArgs as input by the user starting at index[2]
for (var i = 2; i < nodeArgs.length; i++) {
    // if nodeArgs has indexes greater than 2
    if (i > 2 && i < nodeArgs.length) {
        // concatinate indexes adding '+' in between the words
        userInput = userInput + '+' + nodeArgs[i];
    } else {
        // for nodeArgs index[2]
        userInput += nodeArgs[i];
    }

    console.log('userInput is ', userInput);
}


