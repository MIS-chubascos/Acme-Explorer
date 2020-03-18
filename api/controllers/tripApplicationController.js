'use strict';

var mongoose = require('mongoose'),
TripApplication = mongoose.model('TripApplications'),
Trip = mongoose.model('Trip');
var authController = require('./authController');

exports.getTripApplicationV1 = function(req, res) {
    
    TripApplication.findById(req.params.tripApplicationId, function(err, tripApplication) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json(tripApplication);
        }
    });
};

exports.getTripApplicationV2 = async function(req, res) {

    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    TripApplication.findById(req.params.tripApplicationId, function(err, tripApplication) {
        if (err) {
            res.status(500).send(err);

        } else {
            if (authenticatedActorId == tripApplication.explorer || authenticatedActorId == tripApplication.manager) {
                res.json(tripApplication);

            } else {
                res.status(403).send({message: 'You can only display applications you are related to.'});
            }
        }
    });
};

exports.updateTripApplicationV1 = function(req, res) {

    TripApplication.findById(req.params.tripApplicationId, function(err, oldTripApplication) {
        if (err) {
            console.log("ERR: " + err);
            res.status(500).send(err);
        } else {

            if ((oldTripApplication.status == 'PENDING' && req.body.status == 'REJECTED' && req.body.rejectedReason != null && req.body.paidDate == null)
                || (oldTripApplication.status == 'PENDING' && req.body.status == 'DUE' && req.body.rejectedReason == null && req.body.paidDate == null)
                || (oldTripApplication.status == 'DUE' && req.body.status == 'ACCEPTED' && req.body.rejectedReason == null && req.body.paidDate != null)
                || (oldTripApplication.status == 'PENDING' && req.body.status == 'CANCELLED' && req.body.rejectedReason == null && req.body.paidDate == null)
                || (oldTripApplication.status == 'ACCEPTED' && req.body.status == 'CANCELLED' && req.body.rejectedReason == null && req.body.paidDate == null)) {

                    TripApplication.findOneAndUpdate({_id: req.params.tripApplicationId}, 
                        {status: req.body.status, rejectedReason: req.body.rejectedReason, paidDate: req.body.paidDate}, 
                        {new: true}, function(err, newTripApplication) {
                        
                            if (err) {
                                console.log("ERR: " + err);
                                res.status(500).send(err);
            
                            } else {
                                res.json(newTripApplication);
                            }
                    });
            } else {
                res.status(422).send({message: 'Unsupported operation'});
            }
        }
    });
};

exports.updateTripApplicationV2 = async function(req, res) {

    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.explorer) {
        TripApplication.findById(req.params.tripApplicationId, function(err, oldTripApplication) {
            if(err) {
                res.status(500).send(err);

            } else if ((oldTripApplication.status == 'DUE' && req.body.status == 'ACCEPTED' && req.body.rejectedReason == null && req.body.paidDate != null)
                        || (oldTripApplication.status == 'PENDING' && req.body.status == 'CANCELLED' && req.body.rejectedReason == null && req.body.paidDate == null)
                        || (oldTripApplication.status == 'ACCEPTED' && req.body.status == 'CANCELLED' && req.body.rejectedReason == null && req.body.paidDate == null)) {

                            TripApplication.findOneAndUpdate({_id: req.params.tripApplicationId},
                                {status: req.body.status, paidDate: req.body.paidDate}, 
                                {new: true}, function(err, newTripApplication) {
                                
                                    if (err) {
                                        res.status(500).send(err);
                    
                                    } else {
                                        res.json(newTripApplication);
                                    }
                            });
            } else {
                res.status(422).send({message: 'Unsupported operation'});
            }
        });
    } else if (authenticatedActorId == req.body.manager) {
        TripApplication.findById(req.params.tripApplicationId, function(err, oldTripApplication) {
            if(err) {
                res.status(500).send(err);

            } else if ((oldTripApplication.status == 'PENDING' && req.body.status == 'REJECTED' && req.body.rejectedReason != null && req.body.paidDate == null)
                        || (oldTripApplication.status == 'PENDING' && req.body.status == 'DUE' && req.body.rejectedReason == null && req.body.paidDate == null)) {

                            TripApplication.findOneAndUpdate({_id: req.params.tripApplicationId}, 
                                {status: req.body.status, rejectedReason: req.body.rejectedReason}, 
                                {new: true}, function(err, newTripApplication) {
                                
                                    if (err) {
                                        res.status(500).send(err);
                    
                                    } else {
                                        res.json(newTripApplication);
                                    }
                            });
            } else {
                res.status(422).send({message: 'Unsupported operation'});
            }
        });
    } else {
        res.status(403).send({message: 'You can only update applications you are related to.'});
    }
};





exports.getAcceptedTripApplications = function(tripId) {
    
    TripApplication.find({trip: tripId, status: 'ACCEPTED'}, function(err, tripApplications) {
        return tripApplications;
    });
};