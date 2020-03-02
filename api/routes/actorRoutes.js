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

    //given an explorer and a period, return the result of query. check 'sumPrice' atribute 
    app.route('/actors/cubeDataMoney/:explorer/:period')
        .get(actors.cubeDataMoney)

    // get all M[p,e] > V    need ask period, ammount and comparator 
    app.route('/actors/cubeDataComparator/:period/:ammount/:comparator')
        .get(actors.cubeDataComparator)
    };