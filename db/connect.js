// This file will be required anywhere that we need to connect to the database
var mongoose = require('mongoose');
var env = require('../environment');
var config = require('./config');

mongoose.connect(config[env].url);