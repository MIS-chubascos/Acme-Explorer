'use strict'

module.exports = function (app) {
    var actor = require('../controllers/actorController');
    var authController = require('../controllers/authController');
    /**
     * Get actors
     *      Required role: Admin
     * Post an actor
     *      RequiredRoles: Admin
     * 
     *  @section actors
     *   @type get post
     *   @url /v1/actors
     **/
    app.route('/actors')
        .get(actor.listAllActors)
        .post(actor.createAnActor)
    /**
     * Put an actor
     *   RequiredRoles: be the proper actor
     * Get an actor
     *   RequiredRoles: be the proper actor or admin
     * Delete an actor
     * RequiredRoles: be the proper actor or an admin
     * 
     * @section actors
     * @type get put delete
     * @url /actors/:actorId
     */
    app.route('/actors/actorId')
        .get(actor.readAnActor)
        .put(actor.updateAnActor)
        .delete(actor.deleteAnActor)

    /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */
 app.route('/actors/:actorId')
 .put(authController.verifyUser(["ADMINISTRATOR", "MANAGER", "EXPLORER", "SPONSOR"]), actor.update_an_actor)

    
    app.route('/actors/:actorId/tripApplications')
        .get(actor.getTripApplicationsByActor);
};