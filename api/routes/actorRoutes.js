'use strict'

module.exports = function (app) {
    var actors = require('../controllers/actorController');
    
    app.route('/actors')
        .get(actors.listAllActors)
        .post(actors.createAnActor)
    

    app.route('/actors/:actorId')
        .get(actors.readAnActor)
        .put(actors.updateAnActor)
        .delete(actors.deleteAnActor)


    
    app.route('/actors/:actorId/tripApplications')
        .get(actors.getTripApplicationsByActor);
};