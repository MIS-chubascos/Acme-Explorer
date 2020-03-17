const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Trip = mongoose.model('Sponsorship');

const { expect } = chai;
chai.use(chaiHttp);
describe("Trip API Testing", () => {
  it("Get Sponsorships", done => {
    chai
      .request(app)
      .get("/api/v1/sponsorships")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });
//sponsor, trip y banner?
 it("Post Sponsorship", done => {
    var trip = {"_id": "test_sponsorship", "sponsor":"123456", "url":"www.terra.es","banner":"123456","trip":"123456","payed":"True"}
    chai
      .request(app)
      .post("/api/v1/sponsorships")
      .send(trip)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("Update Sponsorship", (done) => {
    var sponsorship = {"url":"www.terra.es","banner":"123456","trip":"123456","payed":"True"}
    chai
      .request(app)
      .put("/api/v1/sponsorships/test_trip")
      .send(sponsorship)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
});
