'use strict';

module.exports = function (app) {
    var sponsorship = require('../controllers/sponsorshipController'); 
    var authController = require('../controllers/authController');

    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods

    app.route(V1_API_PATH + '/sponsorships')
        .get(sponsorship.getAllSponsorships)
        .post(sponsorship.createSponsorship)

    app.route(V1_API_PATH + '/sponsorships/:sponsorshipId')
        .get(sponsorship.getSponsorship)
        .put(sponsorship.updateSponsorship)
        .delete(sponsorship.deleteSponsorship)
    
    app.route(V1_API_PATH + '/trips/:tripId/sponsorships')
        .get(sponsorship.getTripSponsorships)

    app.route(V1_API_PATH + '/trips/:tripId/randomSponsorship')
        .get(sponsorship.getTripRandomSponsorship)
};

    // V2 methods

    app.route(V2_API_PATH + '/sponsorships')
        .post(authController.verifyUser(['MANAGER','SPONSOR']), sponsorships.createSponsorship);

    app.route(V2_API_PATH + '/sponsorships/:sponsorshipId')
        .put(authController.verifyUser(['MANAGER','SPONSOR']), sponsorships.updateSponsorship)
        .delete(authController.verifyUser(['MANAGER','SPONSOR']), sponsorships.deleteSponsorship);

        
