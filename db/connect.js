// This file will be required anywhere that we need to connect to the database
var mongoose = require('mongoose');
var env = require('../environment');
var config = require('./config');

// What environment am I running?
console.log(env);
console.log(process.env.MONGOLAB_URI);
if (env == 'production') {
    mongoose.connect(process.env.MONGOLAB_URI);
} else {
    mongoose.connect(config[env].url);
}
