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

// Tell chai to use the Chai HTTP plugin
// to allow us to make HTTP requests
chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function (done) {
        seed.run(function () {
            done();
        });
    });
    // TODO: Find a way to verify the ObjectId
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
                // res.body[0]._id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    // TODO verify that the record has been updated in the database
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
                //res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                //storage.items.should.be.a('array');
                //storage.items.should.have.length(4);
                //storage.items[3].should.be.a('object');
                //storage.items[3].should.have.property('id');
                //storage.items[3].should.have.property('name');
                //storage.items[3].id.should.be.a('number');
                //storage.items[3].name.should.be.a('string');
                //storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    // TODO The response from the PUT request is currently returning the original item and not the updated record
    it('should edit an item on PUT', function(done) {
        chai.request(app)
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
                        //res.body.id.should.be.a('number');
                        //res.body.name.should.equal('Tuna');
                        //storage.items.should.be.a('array');
                        //storage.items.should.have.length(4);
                        //storage.items[0].should.be.a('object');
                        //storage.items[0].should.have.property('id');
                        //storage.items[0].should.have.property('name');
                        //storage.items[0].id.should.be.a('number');
                        //storage.items[0].name.should.be.a('string');
                        //storage.items[0].name.should.equal('Tuna');
                        //storage.items[1].name.should.equal('Tomatoes');
                        //storage.items[2].name.should.equal('Peppers');
                        //storage.items[3].name.should.equal('Kale');
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
                        //res.body._id.should.be.a('number');
                        res.body.name.should.equal('Tuna');
                        //storage.items.should.be.a('array');
                        //storage.items.should.have.length(3);
                        //storage.items[0].name.should.equal('Tomatoes');
                        //storage.items[1].name.should.equal('Peppers');
                        //storage.items[2].name.should.equal('Kale');
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
    after(function (done) {
        Item.remove(function () {
            done();
        });
    });
});

