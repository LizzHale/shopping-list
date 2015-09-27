// Contains all the logic for creating, reading, updating, and deleting items.
var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        if (err) {
            // If the database operation fails, the errback is called
            errback(err);
            return;
        }
        // If the database operation succeeds, the callback is called
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

