'use strict';

module.exports = function (app) {
    var sponsorship = require('../controllers/sponsorshipController'); 

    app.route('/sponsorships')
        .get(sponsorship.getAllSponsorships)
        .post(sponsorship.createSponsorship)

    app.route('/sponsorships/:sponsorshipId')
        .get(sponsorship.getSponsorship)
        .put(sponsorship.updateSponsorship)
        .delete(sponsorship.deleteSponsorship)
    
    app.route('/trips/:tripId/sponsorships')
        .get(sponsorship.getTripSponsorships)

    app.route('/trips/:tripId/randomSponsorship')
        .get(sponsorship.getTripRandomSponsorship)
};
