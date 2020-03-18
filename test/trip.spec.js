const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trip'),
  Actor = mongoose.model('Actors');

const { expect } = chai;
chai.use(chaiHttp);

describe("Trip API Testing", () => {
  let trip;
  let manager;
  
  beforeEach(done => {
    manager = new Actor({"name" : "Maialen", "email" : "maialen@triunfitos.com", "surname" : "Gómez", "address" : "C/ La Manzana", "password" : "gh5934129022625259_", "phoneNumber" : "1-019-044-6024 x9974", "actorType" : ["MANAGER"]});
    trip = new Trip({"title": "Mystic Falls", "stages":[],"price": 1000, "endDate":"2025-03-18","startDate":"2025-03-13","description":"Amazing trip for otakus","requirements":"be careful with coronavirus","publicationDate":"2025-03-10","manager":manager._id})
    trip.save();
    manager.save({validateBeforeSave: false}).then(() => done());
  })
  
  afterEach(() => {
    trip.remove({}, function(err){
      console.log("Trip removed after tests.")
    })
    manager.remove({}, function(err) {
      console.log("Manager removed after tests. (trip.spec.js)");
    });
  })

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

  it("Get Manager Trips", done => {
    chai
      .request(app)
      .get(`/api/v1/actors/${manager._id}/trips`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post Trip", done => {
    var trip = {"title":"Japan", "stages":[{"title":"Tokyo","price":1000,"order":0,"description":"Amazing trip for otakus"}],"endDate":"2020-03-18","startDate":"2020-03-13","description":"Amazing trip for otakus","requirements":"be careful with coronavirus","publicationDate":"2020-03-10","manager":"12345"}
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

  it("Get Trip", done => {
    chai
      .request(app)
      .get(`/api/v1/trips/${trip._id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Update Trip", (done) => {
    var trip = {"title":"Japan 2", "stages":[{"title":"Tokyo","price":3000,"order":0,"description":"Amazing trip for otakus"}],"endDate":"2020-03-18","startDate":"2020-03-13","description":"Amazing trip for otakus","requirements":"be careful with coronavirus","publicationDate":"2020-03-10","manager":"12345"}
    chai
      .request(app)
      .put(`/api/v1/trips/${trip._id}`)
      .send(trip)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Delete Trip", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/trips/${trip._id}`)
      .send(trip)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Cancel Trip", (done) => {
    chai
      .request(app)
      .post(`/api/v1/trips/${trip._id}/cancel`)
      .send({'cancelReason': 'Coronavirus won...'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
});


