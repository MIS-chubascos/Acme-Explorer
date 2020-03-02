'use strict';

module.exports = function (app) {
    var sponsorship = require('../controllers/sponsorshipController'); 

    app.route('/sponsor')
        .get(sponsorship.getAllSponsorships)
        .post(sponsorship.createSponsorship)

    app.route('/sponsor/:sponsorId')
        .get(sponsorship.getSponsorship)
        .put(sponsorship.updateSponsorship)
        .delete(sponsorship.deleteSponsorship)
    
    app.route('/trips/:tripId/sponsorships')
        .get(trips.getTripSponsorships)

    app.route('/trips/:tripId/randomSponsorship')
        .get(trips.getTripRandomSponsorship)
};
