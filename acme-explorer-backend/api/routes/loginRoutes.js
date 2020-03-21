'use strict'
module.exports = function(app){
    var actors = require('../controllers/actorController');

    app.route('/v1/login/')
        .get(actors.loginAnActor);

}