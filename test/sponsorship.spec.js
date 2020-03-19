const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Sponsorship = mongoose.model('Sponsorships'),
  Actor = mongoose.model('Actors');

const { expect } = chai;
chai.use(chaiHttp);

describe("Sponsorship API Testing", () => {
  let sponsorship;
  let sponsor;
  
  beforeEach(done => {
    sponsor = new Actor({"name" : "Samantha", "email" : "sammy@triunfitos.com", "surname" : "Favorita", "address" : "C/ La Manzana", "password" : "gh5934129022625259_", "phoneNumber" : "1-019-044-6024 x9974", "actorType" : ["SPONSOR"]});
    trip = new Trip({"title": "Mystic Falls", "stages":[],"price": 1000, "endDate":"2025-03-18","startDate":"2025-03-13","description":"Amazing sponsorship for otakus","requirements":"be careful with coronavirus","publicationDate":"2025-03-10"})
    sponsorship = new Sponsorship({"trip": trip._id, "banner": "test", "url": "http://blackpinkofficial.com/", payed: true, sponsor: sponsor._id})
    trip.save({validateBeforeSave: false});
    sponsor.save();
    sponsorship.save().then(() => done());
  })
  
  afterEach(() => {
    sponsorship.remove({}, function(err){
      console.log("Sponsorship removed after tests.")
    })
    trip.remove({}, function(err) {
      console.log("Trip removed after tests. (sponsorship.spec.js)");
    });
    sponsor.remove({}, function(err) {
        console.log("Sponsor removed after tests. (sponsorship.spec.js)");
      });
  })

  it("Get Sponsor Sponsorships", done => {
    chai
      .request(app)
      .get(`/api/v1/actors/${sponsor._id}/sponsorships`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post Sponsorship", done => {
    chai
      .request(app)
      .post("/api/v1/sponsorships")
      .send({"trip": trip._id, "banner": "test", "url": "http://blackpinkofficial.com/", payed: true, sponsor: sponsor._id})
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Get Sponsorship", done => {
    chai
      .request(app)
      .get(`/api/v1/sponsorships/${sponsorship._id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Update Sponsorship", (done) => {
    var newSponsorship = {"trip": trip._id, "banner": "test", "url": "http://everglow.com/", payed: true, sponsor: sponsor._id}
    chai
      .request(app)
      .put(`/api/v1/sponsorships/${sponsorship._id}`)
      .send(newSponsorship)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Delete Sponsorship", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/sponsorships/${sponsorship._id}`)
      .send(sponsorship)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Trip Random Sponsorship", (done) => {
    chai
      .request(app)
      .get(`/api/v1/trips/${trip._id}/randomSponsorship`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
});


