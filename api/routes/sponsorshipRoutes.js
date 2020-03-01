'use strict';

module.exports = function (app) {
    var sponsorship = require('../controllers/sponsorshipController'); 

    app.route('/sponsor')
        .get(sponsorship.list_all_sponsorships)
        .post(sponsorship.create_a_sponsorship)

    app.route('/sponsor/:sponsorId')
        .get(sponsorship.read_a_sponsorship)
        .put(sponsorship.update_a_sponsorship)
        .delete(sponsorship.delete_a_sponsorship)
};
