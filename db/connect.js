// This file will be required anywhere that we need to connect to the database
var mongoose = require('mongoose');
var env = require('../environment');
var config = require('./config');

// What environment am I running?
console.log(config[env].url);

mongoose.connect(config[env].url);