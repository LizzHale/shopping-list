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
                // not sure how I feel about having multiple assertions under one it statement
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                //console.log("This is the GET res");
                //console.log(res);
                done();
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });

    it('should edit an item on PUT', function(done) {
        chai.request(app)
            .put('/items/0')
            .send({ name: 'Tuna', id: 0 })
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Tuna');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[0].should.be.a('object');
                storage.items[0].should.have.property('id');
                storage.items[0].should.have.property('name');
                storage.items[0].id.should.be.a('number');
                storage.items[0].name.should.be.a('string');
                storage.items[0].name.should.equal('Tuna');
                storage.items[1].name.should.equal('Tomatoes');
                storage.items[2].name.should.equal('Peppers');
                storage.items[3].name.should.equal('Kale');
                done();
            })
    });

    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .del('/items/0')
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Tuna');
                storage.items.should.be.a('array');
                storage.items.should.have.length(3);
                storage.items[0].name.should.equal('Tomatoes');
                storage.items[1].name.should.equal('Peppers');
                storage.items[2].name.should.equal('Kale');
                done();
            })
    });

    it('should return 400 status if editing an item that does not exist');
    it('should return 400 status code if deleting an item that does not exist');
    it('should delete a non-zero index item in the list');
    it('should edit a non-zero index item in the list');
});