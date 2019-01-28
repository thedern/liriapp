
// START GENERAL CONFIGS

// code to read and set any environment variables with the dotenv package
require('dotenv').config();

// import axios
var axios = require('axios');

// import keys and enable spotify functionality
var keys = require('./keys.js');

// establish constructor by importing the api, create new spotify object
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// enable file system access
var fs = require('fs');

// import moment and general date/time manipulation
var moment = require('moment');
var now = moment();
// log execution time of the script
logger(`\n-------\n${now}\n-------\n`);

// END GENERAL CONFIGS


// START MOVIE FUNCTION

function movieSearch(movie) {  
    
    // guardian statement for running query without a movie title.
    if (!movie) {
        console.log('please enter a movie for which to search');
        process.exit();
    }
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

            // guardian statement for nonsense input :)
            if (response.data.Error) {
                console.log(`${response.data.Error}`);
                console.log('no movie exists by that name, please search for another');
                process.exit();
            }
        
            var mlogInfo1 = (`Title: ${response.data.Title}\nYear: ${response.data.Year}\nRated: ${response.data.Rated}`);
            console.log(mlogInfo1);
            // call logger
            logger(`${mlogInfo1}\n`);

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
                var mlogInfo2 = (`${source} : ${ratings}`);
                console.log(mlogInfo2);
                // call logger
                logger(`${mlogInfo2}\n`);
            }
            var mlogInfo3 = ( `Country: ${response.data.Country} \nLanguage: ${response.data.Language} \nPlot: ${response.data.Plot} \nActors: ${response.data.Actors}`);
            console.log(mlogInfo3);
            // call logger
            logger(`${mlogInfo3}\n`);
    
        }
    );
}
// END MOVIE FUNCTION


// START BAND SEARCH FUNCTION

function bandSearch(artist) {

    // guardian statement for running query without a movie title.
    if (!artist) {
        console.log('please enter an artist/band for which to search');
        process.exit();
    }

    var bQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    /* We need:
        Name of the venue
        Venue location
        Date of the Event (use moment to format this as "MM/DD/YYYY")
    */

    axios.get(bQueryUrl).then( 
        function(response) {
           
            if (response.data.length === 0 || response.data.includes('warn=Not found')) {
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
                             
                            var blogInfo1 = (`venue name :  ${value[subkey].name}`);
                            console.log(blogInfo1);
                            logger(`${blogInfo1}\n`);
                            var blogInfo2 = (`city : ${value[subkey].city} country ${value[subkey].country}`);
                            console.log(blogInfo2);
                            logger(`${blogInfo2}\n`);
                        }

                        // find the datetime key:value pair (not a sub-sub-object)
                        if (subkey === 'datetime') {
                            // format date with moment js
                            var blogInfo3 = (`${subkey}: ${moment(value[subkey]).format('MM-DD-YYYY')}`);
                            console.log(blogInfo3);
                            logger(`${blogInfo3}\n`);
                            
                        }

                        if (subkey === 'lineup') {
                            var blogInfo4 = (`${subkey}: ${value[subkey]}\n`);
                            console.log(blogInfo4);
                            logger(`${blogInfo4}\n`);

                        }
                    } //end inner for loop
                } // end outtr for loop
            } // end else
        }).catch(function(err){
        console.log('error, there is no artist by that name');
    });// end callback function 
}
// END BAND SEARCH FUNCTION


// START SPOTIFY FUNCTION

function musicSearch(song) {

    // guardian statement for running query without a movie title.
    if (!song) {
        console.log('please enter a song for which to search');
        process.exit();
    }

    spotify.search({ type: 'track', query: song }).then(function(response) {

        /* need the following from spotify
        Artist(s)
        The song's name
        A preview link of the song from Spotify
        The album that the song is from
        */
        
        // guardian statement for nonsense input :)
        if (response.tracks.items.length === 0) {
            console.log('the requested song does not exist within spotify, please search for another')
            process.exit();
        }
        
        // song captures array of tracks
        var song = response.tracks.items;
        // see how many tracks by console logging the length of the song array
        // console.log(song.length);
        for (var i = 0; i < song.length; i++){

            var slogInfo = (`Artist:  ${song[i].artists[0].name}\nSong:  ${song[i].name}\nAlbum:  ${song[i].album.name}\nPreview URL:  ${song[i].preview_url}\n\n`);
            console.log(slogInfo);
            // call logger
            logger(slogInfo);
        }
    
    }).catch(function(err) {
        console.log(err);
    });
}
// END SPOTIFY FUNCTION


// START DO WHAT IT SAYS FUNCTION

function doWhatItSays() {
    
    // read from random.txt
    fs.readFile('./random.txt','utf8', function(err, data) {
        var entries = data.split(',');
        // function call based on random.txt
        switch (entries[0]) {
        case 'movie-this':
            movieSearch(entries[1]);
            break;
        case 'concert-this':
            bandSearch(entries[1]);
            break;
        case 'spotify-this-song':   
            musicSearch(entries[1]); 
            break;
        default:
            console.log('I have no idea what you want me to do!')
        }
    }); 
}
// END DO WHAT IT SAYS FUNCITON


// START LOGGER FUNCTION 

function logger(logText) {
 
    /* using synchronous write else I have instances where data is written to file out of order
       //#endregionI could fix this by changing the way I am logging instead so I could use aysnc writes
       but for such a small anount of data, I don't want to :) */

    fs.appendFileSync('log.txt', logText, function(err) {

        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
    }); 
}
// END LOGGER FUNCTION


///////////  MAIN ///////////

// test for command line args
var nodeArgs = process.argv;

// declare string as empty else get an 'undefined' as first element in array
var userInput = '';

// inspect nodeArgs as input by the user starting at index[3]
for (var i = 3; i < nodeArgs.length; i++) {
    // if nodeArgs has indexes greater than 3, concatinate indexes adding '+' in between the words
    if (i > 3 && i < nodeArgs.length) {
        userInput+= '+' + nodeArgs[i];
    } else {
        // for nodeArgs index[3]
        userInput += nodeArgs[i];
    }
    
}

// switch statement to evaluate user input
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
    // takes no args
    doWhatItSays();
    break;
default:
    console.log('SCRIPT USAGE: \n' +
    'node liri concert-this <band name> \n' +
    'node liri spotify-this-song <song name> \n' +
    'node liri movie-this <movie name> \n' +
    'node liri do-what-it-says \n' +
    '##### please format your request based on the examples above #####');
    process.exit();
}
// END MAIN



