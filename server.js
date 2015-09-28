// Connect to the mongo database with the first line
require('./db/connect');
var express = require('express');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
// var jsonParser = bodyParser.json();
var app = express();
var port = process.env.PORT || 8080;
// express.static is middleware that
// tells express where to find static content
app.use(express.static('public'));
// Middleware to parse the HTTP request body into JSON
app.use(bodyParser.json());

// Middleware to setup item routes
app.use('/', itemRoutes);
// Catch all 404
app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(port, function() {
    console.log('Listening on port ' + port );
});

exports.app = app;