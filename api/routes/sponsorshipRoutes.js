'use strict';

module.exports = function (app) {
    var sponsorships = require('../controllers/sponsorshipController'); 
    var authController = require('../controllers/authController');

    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods
    app.route(V1_API_PATH + '/sponsorships')
        .post(sponsorships.createSponsorship)

    app.route(V1_API_PATH + '/sponsorships/:sponsorshipId')
        .get(sponsorships.getSponsorshipV1)
        .put(sponsorships.updateSponsorshipV1)
        .delete(sponsorships.deleteSponsorshipV1)

    app.route(V1_API_PATH + '/trips/:tripId/randomSponsorship')
        .get(sponsorships.getTripRandomSponsorship)


    // V2 methods

    app.route(V2_API_PATH + '/sponsorships')
        .post(authController.verifyUser(['SPONSOR']), sponsorships.createSponsorship);

    app.route(V2_API_PATH + '/sponsorships/:sponsorshipId')
        .get(authController.verifyUser(['SPONSOR']), sponsorships.getSponsorshipV2)
        .put(authController.verifyUser(['SPONSOR']), sponsorships.updateSponsorshipV2)
        .delete(authController.verifyUser(['SPONSOR']), sponsorships.deleteSponsorshipV2);

    };
