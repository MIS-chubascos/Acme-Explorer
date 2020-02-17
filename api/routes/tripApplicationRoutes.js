'use strict';

module.exports = function(app) {
    var tripApplications = require('../controllers/tripApplicationController');

    app.route('/tripApplications')
        .get(tripApplications.getAllTripApplications)
        .post(tripApplications.createTripApplication);

    app.route('/tripApplications/:tripApplicationId')
        .get(tripApplications.getTripApplication)
        .put(tripApplications.updateTripApplication);

    app.route('/tripApplications/ratioByStatus')
        .get(tripApplications.getRatioByStatus);

}