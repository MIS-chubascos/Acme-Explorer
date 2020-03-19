const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require("mongoose"),
    Finder = mongoose.model("Finders");

const {expect} = chai;
chai.use(chaiHttp);
describe("Finder Testing", () => {
    let finder;

    beforeEach(done => {
        finder = new Finder({"keyword" : "great", "maxPrice" : 500, "explorer" : "5e72415452289a5f0c26f0ed"});
        finder.save({validateBeforeSave: false}).then(() => done());
    });

    afterEach(() => {
        finder.remove({}, function(err) {
            console.log("Finder removed after tests. (finder.spec.js)");
        });
    });

    it("Get Finder", done => {
        chai.request(app).get(`/api/v1/finders/${finder._id}`)
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

    it("Put Finder", done => {
        var finderUpdate = {"keyword" : "great", "maxPrice" : 1000, "explorer" : "5e72415452289a5f0c26f0ed"};

        chai.request(app).put(`/api/v1/finders/${finder._id}`)
        .send(finderUpdate)
        .end((err, res) => {
            expect(res).to.have.status(200);
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it("Get Trips by Finder", done => {
        chai.request(app).get(`/api/v1/finders/${finder._id}/trips`)
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