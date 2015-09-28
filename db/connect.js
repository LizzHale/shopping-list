// This file will be required anywhere that we need to connect to the database
var mongoose = require('mongoose');
var env = require('../environment');
var config = require('./config');

// Use an environment variable for the production database so it isn't exposed
if (env == 'production') {
    mongoose.connect(process.env.MONGOLAB_URI);
} else {
    mongoose.connect(config[env].url);
}
