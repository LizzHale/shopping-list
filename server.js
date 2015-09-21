var express = require('express');
// body-parser module can parse JSON
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

// Since we don't have persistent storage yet
// we'll use a storage object
// Stored in an array, items are objects
// consisting of a name and id.
var Storage = function() {
    this.items = [];
    this.id = 0;
};

// To add an item to the list,
// an item object is created and pushed
// to the item array. The id is then incremented
Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

// A couple of items already added to the list
var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

// Create the express object
var app = express();
// When express.static is middlewhere that
// tells express where to find static content
app.use(express.static('public'));

// Our first endpoint. Serves up the list of
// items in json format
app.get('/items', function(req, res){
    res.json(storage.items);
});

// the second argument tell express to use the
// jsonParser middleware when requests for the route
// are made
app.post('/items', jsonParser, function(req, res){
    // req.body is provided by jsonParser
    // if there is no body or it is incorrectly
    // formatted, the server will respond
    // with a 400 status
    if (!req.body) {
        return res.sendStatus(400);
    }

    // otherwise, use req.body to grab the item
    // name and add to our storage object
    // send a 201 status back
    var item = storage.add(req.body.name);
    res.status(201).json(item);
})

// If we go to '/', the frontend is served.
// How?

// Look for an PORT configured in the environment
// If not there, default to 3000
app.listen(process.env.PORT || 3000);