var express = require('express');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var app = express();
// express.static is middleware that
// tells express where to find static content
app.use(express.static('public'));

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

// Given a source array and id, loop through the source items
// if the source item's id matches the id provided. delete
// return the deleted item { name: "name", id: id }
function deleteByValue(source, id) {
    for (var i = 0; i < source.length; i++){
        // console.log(typeof id) is string
        // console.log(typeof source[i].id); is number
        // use the non-strict equality so the type will be coerced
        if (source[i].id == id) {
            var deleted = source[i];
            source.splice(i, 1);
            return deleted;
        }
    }
    return false;
}

function editByValue(source, id, name){
    for (var i = 0; i < source.length; i++){
        if (source[i].id == id) {
            source[i].name = name;
            return source[i];
        }
    }
    return false;
}

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
});

app.delete('/items/:item_id', jsonParser, function(req, res){
    // delete the item, then send the item back along with the 204 status code
    // if item_id was not valid, del_item will be false
    var del_item = deleteByValue(storage.items, req.params.item_id);
    // use curl -X DELETE localhost:3000/items/49 to test the failure condition
    if (!del_item) {
        return res.status(400).json({ error: 'The item you are trying to delete does not exist'});
    } else {
        // or 202?
        res.status(204).json(del_item);
    }
});

app.put('/items/:item_id', jsonParser, function(req, res){
    var item_name = req.body.name;
    var edit_item = editByValue(storage.items, req.params.item_id, item_name);
    if (!edit_item) {
        return res.status(400).json({ error: 'The item you are trying to edit does not exist'});
    } else {
        // or 202?
        res.status(204).json(edit_item);
    }
});

// If we go to '/', the frontend is served.
// How?

// Look for an PORT configured in the environment
// If not there, default to 3000
app.listen(process.env.PORT || 3000);

exports.app = app;
exports.storage = storage;