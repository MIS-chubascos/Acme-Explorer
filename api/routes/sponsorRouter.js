'use strict';

module.exports = function (app) {
    var sponsor = require('../controllers/sponsorController'); 

    app.route('/v1/sponsor')
        .get(sponsor.list_all_sponsorships)
        .post(sponsor.create_a_sponsorship)

    app.route('/v1/sponsor/:sponsorId')
        .get(sponsor.read_a_sponsorship)
        .put(sponsor.update_a_sponsorship)
        .delete(sponsor.delete_a_sponsorship)
};
