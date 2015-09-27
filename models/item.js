// Contains the item model for validation
var mongoose = require('mongoose');


var ItemSchema = new mongoose.Schema({
    // If an attempt is made to save an item without a name, an error will be thrown
    name: { type: String, required: true }
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;