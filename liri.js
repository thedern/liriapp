
// Start General Configs

// code to read and set any environment variables with the dotenv package
require('dotenv').config();
// import axios
var axios = require("axios");
// import keys
var keys = require('./keys.js');
// Establish constructor by importing the api
var Spotify = require('node-spotify-api');
// create new object
var spotify = new Spotify(keys.spotify);
// console.log('spotify object is ', spotify);

// End General Configs

// Start Movie Function
function movieSearch(movie) {      
    var mQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=1468bff9";
    
    /*
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    */

    axios.get(mQueryUrl).then(
        function(response) {
        
            console.log(`Title: ${response.data.Title}\nYear: ${response.data.Year}\nRated: ${response.data.Rated}`);

            // the critics ratings are a serices of objects (source : rating) from IMDB, Tomatoes, and Metacritic
            for (keys in response.data.Ratings) {
                var values = response.data.Ratings[keys];
                // console.log(values);
                // get the sub-ojects for critics scores and align the source and rating key value pairs for console.log
                // uncomment the console.log above to see key value pairs in sub-objects
                for (var subkeys in values) {
                    if (subkeys === 'Source') {
                        var source = values[subkeys];
                    } else if (subkeys === 'Value') {
                        var ratings = values[subkeys];
                    }
                    
                }
                // formatted key-value pairs
                console.log(`${source} : ${ratings}`);
            }
            console.log( `Country: ${response.data.Country} \nLanguage: ${response.data.Language} \nPlot: ${response.data.Plot} \nActors: ${response.data.Actors} \n`);
    
        }
    );
}
// END MOVIE FUNCTION



// START BAND SEARCH FUNCTION
function bandSearch(artist) {
    var bQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    /* We need:
        Name of the venue
        Venue location
        Date of the Event (use moment to format this as "MM/DD/YYYY") - use Moment
        Aside from formatting with Moment, this works 01/24/2019
    */

    axios.get(bQueryUrl).then( 
        function(response) {
            if (response.data.length === 0) {
                console.log('no concert/show information is available for: ', artist);
            } else {
            /* 
                the response object is one large object consisting of numeric keys who's
                value pair is an object consisting of sub-objects
            */

                // iterate through the returned response object and get the value of each key/value pair and capture it
                for (var key in response.data) {
                    // console.log(key+' : '+ JSON.stringify(response.data[key]));
                    var value = response.data[key];
                    // capture the sub-objects within each returned value
                    for ( var subkey in value) {
                        // console.log(subkey+ ' : ' + value[subkey]);

                        // find the venue sub-sub-object
                        if (subkey === 'venue') {
                            // console.log(subkey, value[subkey]);
                            // test paring data from the venue object
                            console.log('venue name : '+value[subkey].name);
                            console.log('city : '+value[subkey].city+' , '+value[subkey].country);
                        }

                        // find the datetime key:value pair (not a sub-sub-object)
                        if (subkey === 'datetime') {
                            console.log(subkey, value[subkey]);
                            // format date with moment js here
                        }

                        if (subkey === 'lineup') {
                            console.log(subkey, value[subkey],'\n');
                        }
                    } //end inner for loop
                } // end outtr for loop
            } // end else
    
        }); // end callback function 
}
// END BAND SEARCH FUNCTION


// START SPOTIFY FUNCTION

function musicSearch(song) {
    spotify.search({ type: 'track', query: song }).then(function(response) {

        /* need the following from spotify

        Artist(s)
        The song's name
        A preview link of the song from Spotify
        The album that the song is from

        */

        //console.log(response.tracks.items[0]);
        var song = response.tracks.items[0];
        
        console.log(song.artists[0].name);
        console.log(song.name);
        console.log(song.album.name);
        console.log(song.preview_url);

    }).catch(function(err) {
        console.log(err);
    });
}
// END SPOTIFY FUNCTION


////  MAIN ////

// test for command line args
var nodeArgs = process.argv;

// declare string as empty else get an 'undefined' as first element in array
var userInput = '';

/* 
    Guardian Statement
    Check if index[2] is empty or a parameter other than expected
    || nodeArgs[2] !== 'concert-this' || nodeArgs[2] !== 'spotify-this-song' || nodeArgs[2] !== 'movie-this' || nodeArgs[2] !== 'do-what-it-says'
*/
if (!nodeArgs[2]) {
    // useage statement
    console.log('SCRIPT USAGE: \n' +
        'node liri concert-this <band name> \n' +
        'node liri spotify-this-song <song name> \n' +
        'node liri movie-this <movie name> \n' +
        'node liri do-what-it-says \n' +
        '##### please format your request based on the examples above #####');
    process.exit();
}

// inspect nodeArgs as input by the user starting at index[3]
for (var i = 3; i < nodeArgs.length; i++) {
    // if nodeArgs has indexes greater than 3
    if (i > 3 && i < nodeArgs.length) {
        // concatinate indexes adding '+' in between the words
        userInput+= '+' + nodeArgs[i];
    } else {
        // for nodeArgs index[2]
        userInput += nodeArgs[i];
    }
    
}


switch (nodeArgs[2]) {
case 'movie-this':
    movieSearch(userInput);
    break;
case 'concert-this':
    bandSearch(userInput);
    break;
case 'spotify-this-song':   
    musicSearch(userInput); 
    break;
case 'do-what-it-says':
    console.log('go to do-function');
    break;
default:
    console.log('??????????');
}




