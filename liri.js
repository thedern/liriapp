
// code to read and set any environment variables with the dotenv package
require('dotenv').config();
// import axios
var axios = require("axios");

// test axios - this just a test and will need to be addressed and moved to the correct part of my program
axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy").then(
    function(response) {
        console.log("The movie's rating is: " + response.data.imdbRating);
    }
);

// test bands in town
var artist = 'foo fighters';
axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
    function(response) {
        console.log(response.data);
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


