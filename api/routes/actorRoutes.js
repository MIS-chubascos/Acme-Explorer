'use strict'

module.exports = function (app) {
    var actors = require('../controllers/actorController');
    var authController = require('../controllers/authController');
    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';
    
    // V1 methods not checking roles
    app.route(V1_API_PATH +'/actors') 
        .get(actors.listAllActors)
        .post(actors.createAnActor)
    

    app.route(V1_API_PATH + '/actors/:actorId')
        .get(actors.readAnActor)
        .put(actors.updateAnActor)
        .delete(actors.deleteAnActor)

    app.route(V1_API_PATH + '/actors/:actorId/tripApplications')
        .get(actors.getTripApplicationsByActor);


    // V2 methods cheching roles (middleware or in the method indeed)
    app.route(V2_API_PATH + '/actors/:actorId')
        .post(actors.createAnActorVerified)
        .delete(authController.verifyUser(['ADMINISTRATOR']),actors.deleteAnActor)
        .put(authController.verifyUser(['ADMINISTRATOR',
                                        'MANAGER',
                                        'EXPLORER',
                                        'SPONSOR']),actors.updateAnActorVerified)
    
    app.route(V2_API_PATH + '/actors/:actorId/tripApplications')
        .get(authController.verifyUser(['EXPLORER', 'MANAGER']), actors.getTripApplicationsByActor);
        
                                        



    //given an explorer and a period, return the result of query. check 'sumPrice' atribute 
    app.route(V1_API_PATH +'/actors/cubeDataMoney/:explorer/:period')
        .get(actors.cubeDataMoney)

    // get all M[p,e] > V    need ask period, ammount and comparator 
    app.route(V1_API_PATH +'/actors/cubeDataComparator/:period/:ammount/:comparator')
        .get(actors.cubeDataComparator)
    };