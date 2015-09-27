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

exports.update = function(id, name, callback, errback) {
    // setting the new option to true will return the modified document rather than the original
    Item.findOneAndUpdate({_id: id}, {name: name}, { new: true }, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.delete = function(id, callback, errback) {
    Item.findByIdAndRemove(id, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

