'use strict';

module.exports = function (app) {
    var config = require('../controllers/configController');

    app.route('/v1/config')
        .get(config.getConfig)
        .put(config.updateConfig)
}