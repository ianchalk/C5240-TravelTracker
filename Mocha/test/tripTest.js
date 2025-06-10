var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test trip by id result', function () {
//	this.timeout(15000);

	var requestResult;
	var response;
	var testTripId = "1749177598741";
		 
    before(function (done) {
        chai.request('https://traveltracker2025.azurewebsites.net/')
			.get("/trip/" + testTripId)
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    

	it('Should return status 200', function () {
        expect(response).to.have.status(200);
    });
    
    it('Return value should be an object', function () {
        expect(requestResult).to.be.an('object');
        expect(requestResult).to.not.be.an('array');
    });
    
    it('Return type of body should be JSON', function () {
        expect(response).to.be.json;
    });
    
    it('Object should contain expected attribute names', function () {
        expect(requestResult).to.include.keys('name');
        expect(requestResult).to.include.keys('description');
        expect(requestResult).to.include.keys('tripId');
    });
    
    it('Object should contain expected attribute types', function () {
        expect(requestResult.name).to.be.a('string');
        expect(requestResult.description).to.be.a('string');
        expect(requestResult.tripId).to.be.a('string');
    });
    
    it('Object should contain an id', function () {
        expect(requestResult).to.have.property('_id');

        expect(requestResult).to.have.property('tripId');
    });
    
    it('The returned object should match the requested tripId', function () {
        expect(requestResult.tripId).to.equal(testTripId);
    });
});