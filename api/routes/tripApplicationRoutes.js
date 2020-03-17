'use strict';

module.exports = function(app) {
    var tripApplications = require('../controllers/tripApplicationController');
    var authController = require('../controllers/authController');
    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods
    app.route(V1_API_PATH + '/tripApplications/:tripApplicationId')
        .get(tripApplications.getTripApplication)
        .put(tripApplications.updateTripApplication);

    // V2 methods
    app.route(V2_API_PATH + '/tripApplications/:tripApplicationId')
        .get(authController.verifyUser(['EXPLORER', 'MANAGER']), tripApplications.getTripApplication)
        .put(authController.verifyUser(['EXPLORER', 'MANAGER']), tripApplications.updateTripApplication);

}