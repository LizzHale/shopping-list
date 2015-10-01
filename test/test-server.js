var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

// Chai allows you to use different syntax to do assertions
// We're using "should"
// var should = chai.should();
var should = require('chai').should();

// app comes from the express app function
var app = server.app;

// For use during the tests to avoid nesting another get request
function retrieveCurrentDatabase(callback) {
    Item.find(function(err, items) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, items);
        }
    });
};

// Tell chai to use the Chai HTTP plugin
// to allow us to make HTTP requests
chai.use(chaiHttp);

describe('Shopping List', function() {
    beforeEach(function (done) {
        seed.run(function () {
            done();
        });
    });
    it('should list items on GET', function (done) {
        chai.request(app)
            .get('/items')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                // The _id (ObjectId) is a 12-byte BSON type
                // Although the database record does not appear to
                // store the _id as a string,
                // the response returns a string
                res.body[0]._id.should.be.a('string');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({ 'name': 'Kale' })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                // Verify the database contents using a callback function
                retrieveCurrentDatabase(function(err, items) {
                    if (err) {
                        console.log(err);
                    }
                    items.should.be.a('array');
                    items.should.have.length('4');
                    items[0].name.should.equal('Broad beans');
                    items[1].name.should.equal('Tomatoes');
                    items[2].name.should.equal('Peppers');
                    items[3].name.should.equal('Kale');
                    items[3].should.have.property('_id');
                    items[3].should.have.property('name');
                });
                done();
            });
    });
    it('should edit an item on PUT', function(done) {
        chai.request(app)
            // Using a GET request to grab the id for one of the items for use in the PUT request test
            // TODO find alternative to nested chai.requests to avoid uninformative failures (i.e. broken GET request)
            .get('/items')
            .end(function(err, res) {
                chai.request(app)
                    .put('/items/' + res.body[0]._id)
                    .send({ 'name': 'Tuna' })
                    .end(function(err, res){
                        should.equal(err, null);
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('_id');
                        res.body.name.should.be.a('string');
                        res.body._id.should.be.a('string');
                        res.body.name.should.equal('Tuna');
                        retrieveCurrentDatabase(function(err, items) {
                            if (err) {
                                console.log(err);
                            }
                            items.should.be.a('array');
                            items.should.have.length('3');
                            items[0].name.should.equal('Tuna');
                            items[0].should.have.property('_id');
                            items[0].should.have.property('name');
                            items[1].name.should.equal('Tomatoes');
                            items[2].name.should.equal('Peppers');
                        });
                        done();
                    });
            });
    });
    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                chai.request(app)
                    .del('/items/' + res.body[0]._id)
                    .end(function(err, res){
                        should.equal(err, null);
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('_id');
                        res.body.name.should.be.a('string');
                        res.body._id.should.be.a('string');
                        res.body.name.should.equal('Broad beans');
                        retrieveCurrentDatabase(function(err, items) {
                            if (err) {
                                console.log(err);
                            }
                            items.should.be.a('array');
                            items.should.have.length(2);
                            items[0].name.should.equal('Tomatoes');
                            items[1].name.should.equal('Peppers');
                        });
                        done();
                    });
            });
    });
    it('should return 400 status if editing an item that does not exist', function(done){
        chai.request(app)
            .put('/items/55')
            .send({ 'name': 'Tuna', 'id': 55 })
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    it('should return 400 status code if deleting an item that does not exist', function(done){
        chai.request(app)
            .del('/items/55')
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    afterEach(function (done) {
        Item.remove(function () {
            done();
        });
    });
});

