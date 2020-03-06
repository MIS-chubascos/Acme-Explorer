'use strict'

module.exports = function (app) {
    var actors = require('../controllers/actorController');
    var authController = require('../controllers/authController')
    
    app.route('/v1/actors') //Not checking role
        .get(actors.listAllActors)
        .post(actors.createAnActor)
    

    app.route('/v1/actors/:actorId') //not checking roles
        .get(actors.readAnActor)
        .put(actors.updateAnActor)
        .delete(actors.deleteAnActor)


    //v2 checking roles
    app.route('/v2/actors/:actorId')
        .put(authController.verifyUser(['ADMINISTRATOR',
                                        'MANAGER',
                                        'EXPLORER',
                                        'SPONSOR']),actors.updateAnActorVerified)


    app.route('/actors/:actorId/tripApplications')
        .get(actors.getTripApplicationsByActor);

    //given an explorer and a period, return the result of query. check 'sumPrice' atribute 
    app.route('/actors/cubeDataMoney/:explorer/:period')
        .get(actors.cubeDataMoney)

    // get all M[p,e] > V    need ask period, ammount and comparator 
    app.route('/actors/cubeDataComparator/:period/:ammount/:comparator')
        .get(actors.cubeDataComparator)
    };