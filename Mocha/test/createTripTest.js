var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

// NEW TEST SUITE: Test for creating a new trip
describe('Test POST /trip/create', function () {
    
    const tripId = Date.now().toString();
    var requestResult;
    var response;
    var tripToCreate = {
        name: 'Trip to the Alps',
        description: 'A test trip created by Mocha and Chai-HTTP',
        tripId: tripId,
        userId: '68487e36d12459e849b02549', // A placeholder user ID from your test DB
        isPublic: true
    };

    before(function(done) {
        chai.request('https://traveltracker2025.azurewebsites.net/')
            .post('/trip/create')
            .send(tripToCreate) // Send the trip data in the request body
            .end(function(err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                done();
            });
    });

    it('Should return status 201 Created', function() {
        // According to your TripModel.ts, a successful creation returns 201
        expect(response).to.have.status(201);
    });

    it('Return value should be an object', function() {
        expect(requestResult).to.be.an('object');
    });

    it('Return type of body should be JSON', function() {
        expect(response).to.be.json;
    });

    it('Returned object should have the correct properties', function() {
        expect(requestResult).to.have.property('_id');
        expect(requestResult).to.have.property('name');
        expect(requestResult).to.have.property('description');
        expect(requestResult).to.have.property('tripId');
        expect(requestResult).to.have.property('userId');
    });

    it('Returned object values should match the sent data', function() {
        expect(requestResult.name).to.equal(tripToCreate.name);
        expect(requestResult.description).to.equal(tripToCreate.description);
        expect(requestResult.tripId).to.equal(tripToCreate.tripId);
        expect(requestResult.userId).to.equal(tripToCreate.userId);
    });
});