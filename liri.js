
// code to read and set any environment variables with the dotenv package
require("dotenv").config();

// import keys
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// pseudo-code

/* Step 1
use argv to accept the following input
concert-this
spotify-this-song
movie-this
do-what-it-says

*/

