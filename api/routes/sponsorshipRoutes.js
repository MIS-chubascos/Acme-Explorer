'use strict';

module.exports = function (app) {
    var sponsorships = require('../controllers/sponsorshipController'); 
    var authController = require('../controllers/authController');

    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods
    app.route(V1_API_PATH + '/sponsorships')
        .get(sponsorships.getAllSponsorships)
        .post(sponsorships.createSponsorship)

    app.route(V1_API_PATH + '/sponsorships/:sponsorshipId')
        .get(sponsorships.getSponsorship)
        .put(sponsorships.updateSponsorship)
        .delete(sponsorships.deleteSponsorship)
    
    app.route(V1_API_PATH + '/trips/:tripId/sponsorships')
        .get(sponsorships.getTripSponsorships)

    app.route(V1_API_PATH + '/trips/:tripId/randomSponsorship')
        .get(sponsorships.getTripRandomSponsorship)


    // V2 methods

    app.route(V2_API_PATH + '/sponsorships')
        .post(authController.verifyUser(['MANAGER','SPONSOR']), sponsorships.createSponsorship);

    app.route(V2_API_PATH + '/sponsorships/:sponsorshipId')
        .put(authController.verifyUser(['MANAGER','SPONSOR']), sponsorships.updateSponsorship)
        .delete(authController.verifyUser(['MANAGER','SPONSOR']), sponsorships.deleteSponsorship);

    };
