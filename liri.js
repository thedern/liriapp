
// code to read and set any environment variables with the dotenv package
require("dotenv").config();

// import keys
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

