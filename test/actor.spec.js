const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
var mongoose = require('mongoose'),
    Actor = mongoose.model('Actors');

const { expect } = chai;

chai.use(chaiHttp);
let actor;

beforeEach(done =>{
    actor = new Actor({"name":"testName", "surname":"testSurname", "email":"test@mail.com", "phoneNumber":"123456789", "address":"here","password":"password","actorType":["ADMINISTRATOR","EXPLORER"]})
    actor.save().then(() => done());
})

afterEach(() => {
    actor.remove({}, function(err){
        console.log("Actor removed after test")
    })
})

describe("Actor class test", () =>{
    it("Get all actors test", done =>{
        chai
        .request(app)
        .get("/api/v1/actors")
        .end((err,res) => {
            expect(res).to.have.status(200);
            expect(res).not.to.be.empty;
            if (err) done(err);
            else done();
        });
    });

    
    it('Post an actor', done =>{
        var actor = {"name":"John", "surname":"Doe", "email":"john@mail.com", "phoneNumber":"987654321", "address":"over there","password":"pw0rd","actorType":["ADMINISTRATOR","EXPLORER"]}
        chai
        .request(app)
        .post('/api/v1/actors')
        .send(actor)
        .end((err,res)=>{
            expect(res).to.have.status(200);
            if (err) done(err);
            else done();
        });
    });
    

});