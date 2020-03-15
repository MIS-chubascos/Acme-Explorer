const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trip');

const { expect } = chai;
chai.use(chaiHttp);
describe("Trip API Testing", () => {
  it("Get Trips", done => {
    chai
      .request(app)
      .get("/api/v1/trips")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });


  it("Post Trip", done => {
    var trip = {"_id": "test_trip", "title":"Japan", "stages":[{"title":"Tokyo","price":1000,"order":0,"description":"Amazing trip for otakus"}],"endDate":"2020-03-18","startDate":"2020-03-13","description":"Amazing trip for otakus","requirements":"be careful with coronavirus","publicationDate":"2020-03-10","manager":"12345"}
    chai
      .request(app)
      .post("/api/v1/trips")
      .send(trip)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Update Trip", (done) => {
    var trip = {"title":"Japan 2", "stages":[{"title":"Tokyo","price":3000,"order":0,"description":"Amazing trip for otakus"}],"endDate":"2020-03-18","startDate":"2020-03-13","description":"Amazing trip for otakus","requirements":"be careful with coronavirus","publicationDate":"2020-03-10","manager":"12345"}
    chai
      .request(app)
      .put("/api/v1/trips/test_trip")
      .send(trip)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
});
