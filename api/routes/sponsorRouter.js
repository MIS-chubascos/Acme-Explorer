'use strict';

module.exports = function (app) {
    var sponsor = require('../controllers/sponsorController'); //Solo se muestra si ha pagado

    app.route('/v1/sponsor/search')
        .get(sponsor.search_a_sponsor);

    app.route('/v1/sponsor/:sponsorId')
        .put(sponsor.update_a_sponsor)
        .delete(sponsor.delete_a_sponsor);

    app.route('/v1/sponsor')
        .post(sponsor.create_a_sponsor);

};
