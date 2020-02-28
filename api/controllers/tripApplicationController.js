'use strict';

var mongoose = require('mongoose'),
TripApplication = mongoose.model('TripApplications'),
Trip = mongoose.model('Trip');

exports.getAllTripApplications = function(req, res) {
    TripApplication.find(function(err, tripApplications) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(tripApplications);
        }
    });
};

exports.getAcceptedTripApplications = function(req, res) {
    //Check if the user is a manager and if not: res.status(403); "only managers can list accepted applications"
    //Check if the trip is related to the manager and if not: res.status(403); "only the manager of the trip can list its applications"

    TripApplication.find({trip: req.params.tripId, status: 'ACCEPTED'}, function(err, tripApplications) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(tripApplications);
        }
    });
};

exports.getTripApplication = function(req, res) {
    //Check if the user is an explorer or a manager and if not: res.status(403); "only explorers and managers can display applications"
    //Check if the user is an explorer and the tripApplication is hers and if not: res.status(403); "explorers can only display the applications they created"
    //Check if the user is a manager and the tripApplication is associated to a trip she manages and if not: res.status(403); "managers can only display applications associated to the trips they manage"

    TripApplication.findById(req.params.tripApplicationId, function(err, tripApplication) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json(tripApplication);
        }
    });
};

exports.updateTripApplication = function(req, res) {
    //Check if the user is an explorer or a manager and if not: res.status(403); "only explorers and managers can update applications"
    //Check if the user is an explorer and the tripApplication is hers and if not: res.status(403); "explorers can only update the applications they created"
    //Check if the user is a manager and the tripApplication is associated to a trip she manages and if not: res.status(403); "managers can only update applications associated to the trips they manage"

    TripApplication.findById(req.params.tripApplicationId, function(err, oldTripApplication) {
        if (err) {
            res.status(500).send(err);
        } else {

            if ((oldTripApplication.status == 'PENDING' && req.body.status == 'REJECTED' && req.body.rejectedReason != null && req.body.paidDate == null) //check if the user is a manager
                || (oldTripApplication.status == 'PENDING' && req.body.status == 'DUE' && req.body.rejectedReason == null && req.body.paidDate == null) //check if the user is a manager
                || (oldTripApplication.status == 'DUE' && req.body.status == 'ACCEPTED' && req.body.rejectedReason == null && req.body.paidDate != null) //check if the user is an explorer
                || (oldTripApplication.status == 'PENDING' && req.body.status == 'CANCELLED' && req.body.rejectedReason == null && req.body.paidDate == null) //check if the user is an explorer
                || (oldTripApplication.status == 'ACCEPTED' && req.body.status == 'CANCELLED' && req.body.rejectedReason == null && req.body.paidDate == null)) { //check if the user is an explorer

                    TripApplication.findOneAndUpdate({_id: req.params.tripApplicationId}, 
                        {status: req.body.status, rejectedReason: req.body.rejectedReason, paidDate: req.body.paidDate}, 
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
        }
    });
};

exports.deleteTripApplication = function(req, res) {
    TripApplication.remove({_id: req.params.tripApplicationId}, function(err, tripApplication) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json({message: 'Trip aplication successfully deleted'})
        }
    });
};