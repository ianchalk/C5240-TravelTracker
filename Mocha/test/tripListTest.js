var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test trip lists result', function () {
//	this.timeout(15000);

	var requestResult;
	var response;
		 
    before(function (done) {
        chai.request("https://traveltracker2025.azurewebsites.net/")
			.get("/trip")
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return an array object with more than 2 objects', function (){
		expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
		expect(response.body).to.have.length.above(2);
		expect(response).to.have.headers;
    });
    
	it('The first entry in the array has known properties', function(){
	    expect(requestResult[0]).to.include.keys('name');
	    expect(requestResult[0]).to.have.property('_id');
		expect(response.body[0]).to.have.deep.property('tripId');
		expect(response.body).to.not.be.a.string;
	});

	it('The elements in the array have the expected properties', function(){
		expect(response.body).to.have.length(3);
		expect(response.body).to.satisfy(
			function (body) {
				for (var i = 0; i < body.length; i++) {
					expect(body[i].name).to.be.a('string');
					expect(body[i].description).to.be.a('string');
					expect(body[i].tripId).to.be.a('string');
				}
				return true;
			});
	});	
	
});