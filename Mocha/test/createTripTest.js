var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test POST /trip/create-with-places', function () {
    
    const tripId = Date.now().toString();
    var requestResult;
    var response;
    var tripWithPlacesToCreate = {
        name: 'Culinary Tour of Italy',
        description: 'A delicious journey through various Italian cities.',
        userId: '68476a58090ae0e735e64c33',
        isPublic: true,
        places: [
            {
                name: 'Roman Colosseum',
                description: 'Historical site visit.',
                startDate: new Date('2025-08-01'),
                endDate: new Date('2025-08-02'),
                cost: 50
            },
            {
                name: 'Florence Art Gallery',
                description: 'See the statue of David.',
                startDate: new Date('2025-08-03'),
                endDate: new Date('2025-08-04'),
                cost: 75
            }
        ]
    };

    before(function(done) {
        chai.request('https://traveltracker2025.azurewebsites.net/')
            .post('/trip/create-with-places')
            .send(tripWithPlacesToCreate)
            .end(function(err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                done();
            });
    });

    it('Should return status 201 Created', function() {
        expect(response).to.have.status(201);
    });

    it('Return value should be an object', function() {
        expect(requestResult).to.be.an('object');
    });

    it('Return type of body should be JSON', function() {
        expect(response).to.be.json;
    });

    it('Returned object should have the correct properties', function() {
        const createdTrip = requestResult.trip;

        expect(createdTrip).to.have.property('_id');
        expect(createdTrip).to.have.property('name');
        expect(createdTrip).to.have.property('description');
        expect(createdTrip).to.have.property('tripId');
        expect(createdTrip).to.have.property('userId');
    });

    it('The created trip data within the response should be correct', function() {
        const createdTrip = requestResult.trip;

        // Check values that should match the request
        expect(createdTrip.name).to.equal(tripWithPlacesToCreate.name);
        expect(createdTrip.description).to.equal(tripWithPlacesToCreate.description);
        expect(createdTrip.userId).to.equal(tripWithPlacesToCreate.userId);
        expect(createdTrip.isPublic).to.equal(tripWithPlacesToCreate.isPublic);
    });

    it('The created trip data within the response should be correct', function() {
        const createdTrip = requestResult.trip;
        expect(createdTrip.name).to.equal(tripWithPlacesToCreate.name);
        expect(createdTrip.userId).to.equal(tripWithPlacesToCreate.userId);
    });
});