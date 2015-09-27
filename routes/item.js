// Contains the HTTP routes
var express = require('express');
var Item = require('../services/item');
// Instead of adding routes to the express app object, use the router object
var router = express.Router();

router.get('/items', function(req, res) {
    // Notice the routes are delegated to the service layer
    Item.list(function(items) {
        res.json(items);
    }, function(err) {
        res.status(400).json(err);
    });
});

router.post('/items', function(req, res) {
    Item.save(req.body.name, function(item) {
        res.status(201).json(item);
    }, function(err) {
        res.status(400).json(err);
    });
});

module.exports = router;