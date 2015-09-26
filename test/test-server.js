var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

// Chai allows you to use different syntax to do assertions
// We're using "should"
// var should = chai.should();
var should = require('chai').should();

// app comes from the express app function
var app = server.app;
// storage is our instance of the Storage object
var storage = server.storage;

// Tell chai to use the Chai HTTP plugin
// to allow us to make HTTP requests
chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        // we could also use a base url (production perhaps) as the foundation
        // chai.request('http://agile-island-3631.herokuapp.com')
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should add an item on POST');
    it('should edit an item on PUT');
    it('should delete an item on DELETE');
    it('should return 400 status if editing an item that does not exist');
    it('should return 400 status code if deleting an item that does not exist');
    it('should delete a non-zero index item in the list');
    it('should edit a non-zero index item in the list');
});