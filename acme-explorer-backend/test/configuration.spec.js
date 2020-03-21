const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
var mongoose = require('mongoose'),
    Configuration = mongoose.model('Config');

const {expect} = chai;
chai.use(chaiHttp);

describe("Configuration class test", () =>{
    let conf;

    beforeEach(done =>{
        conf = new Configuration({"flatRate":2, "finderMaxResults":5, "finderCacheTime":15})
        conf.save().then(() => done());
    })

    afterEach(() => {
        conf.remove({}, function(err){
            console.log("Configuration removed after test")
        })
    })

        it("Get the config", done =>{
            chai
            .request(app)
            .get("/api/v1/config")
            .end((err, res)=>{
                expect(res).to.have.status(200);
                expect("Content-Type", /json/);
                if(err) done(err);
                else done();
            });
        });


        it("Put the config", done =>{
            conf = new Configuration({"flatRate":1, "finderMaxResults":3, "finderCacheTime":10})
            chai
            .request(app)
            .put("/api/v1/config/${configuration._id}")
            .send(conf)
            .end((err,res) => {
                expect(res).to.have.status(200);
                expect("Content-Type", /json/);
                if(err) done(err);
                else done();
            });
        });
});