const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require("mongoose"),
    TripApplication = mongoose.model("TripApplications"),
    Trip = mongoose.model('Trip'),
    Actor = mongoose.model('Actors');

const {expect} = chai;
chai.use(chaiHttp);
describe("Trip Applications Testing", () => {
    let trip;
    let tripApplication;
    let explorer;
    let manager;

    beforeEach(done => {
        trip = new Trip({"title": "test_trip", "stages": [], "price": 1000, "endDate": "2025-03-18", "startDate": "2025-03-13", "description": "Amazing trip", "requirements": "Be careful", "publicationDate": "2019-03-10", "manager": "5e72032349179c55b44c41dd"});
        explorer = new Actor({"name" : "Adolfo", "email" : "adolfo30543@gmail.com", "surname" : "Pérez", "address" : "C/ La Palmera", "password" : "a009919069686959547_", "phoneNumber" : "1-197-379-2965", "actorType" : ["EXPLORER"]});
        manager = new Actor({"name" : "Gerarda", "email" : "gera21321@yahoo.com", "surname" : "Gómez", "address" : "C/ La Manzana", "password" : "gh5934129022625259_", "phoneNumber" : "1-019-044-6024 x9974", "actorType" : ["MANAGER"]});
        tripApplication = new TripApplication({"moment": "2020-05-05", "status": "PENDING", "explorer": explorer._id, "manager": manager._id});

        trip.save({validateBeforeSave: false});
        tripApplication.save({validateBeforeSave: false});
        explorer.save({validateBeforeSave: false});
        manager.save({validateBeforeSave: false}).then(() => done());
    });

    afterEach(() => {
        trip.remove({}, function(err) {
            console.log("Trip removed after tests. (tripApplication.spec.js)");
        });

        tripApplication.remove({}, function(err) {
            console.log("Trip Application removed after tests. (tripApplication.spec.js)");
        });

        explorer.remove({}, function(err) {
            console.log("Explorer removed after tests. (tripApplication.spec.js)");
        });

        manager.remove({}, function(err) {
            console.log("Manager removed after tests. (tripApplication.spec.js)");
        });
    });

    it("Post Trip Application", done => {
        var tripApplication = {"moment": "2020-05-05", "status": "PENDING", "explorer": explorer._id, "manager": manager._id};

        chai.request(app).post(`/api/v1/trips/${trip._id}/tripApplications`)
        .send(tripApplication)
        .end((err, res) => {
            expect(res).to.have.status(200);
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it("Get Trip Application", done => {
        chai.request(app).get(`/api/v1/tripApplications/${tripApplication._id}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect('Content-Type', /json/);
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it("Put Trip Application", done => {
        var tripApplicationUpdate = {"moment": "2020-05-05", "status": "DUE", "explorer": explorer._id, "manager": manager._id};

        chai.request(app).put(`/api/v1/tripApplications/${tripApplication._id}`)
        .send(tripApplicationUpdate)
        .end((err, res) => {
            expect(res).to.have.status(200);
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it("Get Trip Applications of Explorer", done => {
        chai.request(app).get(`/api/v1/actors/${explorer._id}/tripApplications?explorer=true`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect('Content-Type', /json/);
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it("Get Trip Applications of Manager", done => {
        chai.request(app).get(`/api/v1/actors/${manager._id}/tripApplications?explorer=false`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect('Content-Type', /json/);
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });
});