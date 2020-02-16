'use strict';

module.exports = function(app) {
    var finders = require('../controllers/finderController');

    app.route('/finders/:finderId')
        .get(finders.getFinder)
        .put(finders.updateFinder);

    app.route('/finders/:finderId/trips')
        .get(finders.getTripsByFinder);

}