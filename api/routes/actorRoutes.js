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
        .delete(actors.deleteAnActorV1)

    app.route(V1_API_PATH + '/actors/:actorId/tripApplications')
        .get(actors.getTripApplicationsByActorV1);


    app.route(V1_API_PATH + '/actors/:actorId/trips')
        .get(actors.getManagerTripsV1)

    app.route(V1_API_PATH + '/actors/:actorId/sponsorships')
        .get(actors.getSponsorSponsorshipsV1)

    // V2 methods cheching roles (middleware or in the method indeed)
    app.route(V2_API_PATH + '/actors/:actorId')
        .post(actors.createAnActorVerified)
        .delete(authController.verifyUser(['ADMINISTRATOR']),actors.deleteAnActorV2)
        .put(authController.verifyUser(['ADMINISTRATOR',
                                        'MANAGER',
                                        'EXPLORER',
                                        'SPONSOR']),actors.updateAnActorVerified)
    
    app.route(V2_API_PATH + '/actors/:actorId/tripApplications')
        .get(authController.verifyUser(['EXPLORER', 'MANAGER']), actors.getTripApplicationsByActorV2);
        
    app.route(V2_API_PATH + '/actors/:actorId/trips')
        .get(authController.verifyUser(['MANAGER']), actors.getManagerTripsV2) 

    app.route(V2_API_PATH + '/actors/:actorId/sponsorships')
        .get(authController.verifyUser(['SPONSOR']), actors.getSponsorSponsorshipsV2);
}