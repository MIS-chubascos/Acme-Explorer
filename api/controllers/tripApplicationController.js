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

exports.createTripApplication = function(req, res) {
    //Check if the user is an explorer and if not: res.status(403); "only explorers can create applications"

    var newTripApplication = new TripApplication(req.body);

    var trip = await Trip.findOne({_id: req.body.trip}).exec();
    var now = new Date();

    if (trip.publicationDate > now) {
        res.status(422).send({message: 'The corresponding trip has not been published yet'});

    } else if (trip.startDate < now) {
        res.status(422).send({message: 'The corresponding trip has already started'});

    } else if (trip.cancelReason) {
        res.status(422).send({message: 'The corresponding trip is cancelled'})

    } else {
        newTripApplication.save(function(err, tripApplication) {
            if (err) {
                if (err.name == 'ValidationError') {
                    res.status(422).send(err);
    
                } else {
                    res.status(500).send(err);
                }
    
            } else {
                res.json(tripApplication);
            }
        });
    }
};

exports.updateTripApplication = function(req, res) {
    //Check if the user is an explorer or a manager and if not: res.status(403); "only explorers and managers can display applications"
    //Check if the user is an explorer and the tripApplication is hers and if not: res.status(403); "explorers can only display the applications they created"
    //Check if the user is a manager and the tripApplication is associated to a trip she manages and if not: res.status(403); "managers can only display applications associated to the trips they manage"

    TripApplication.findById(req.params.tripApplicationId, function(err, oldTripApplication) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);

            } else {
                res.status(500).send(err);
            }

        } else {
            if (oldTripApplication.status == 'PENDING' && req.body.status != 'REJECTED' && req.body.status != 'DUE') { // for managers
                res.status(422).send({message: 'Applications with status \'PENDING\' can only change to \'REJECTED\' or \'DUE\''});

            } else if (oldTripApplication.status == 'PENDING' && req.body.status == 'REJECTED' && !req.body.rejectedReason) { // for managers
                res.status(422).send({message: 'When rejecting an application you must specify a rejection reason'});

            } else if (oldTripApplication.status != 'DUE' && req.body.status == 'ACCEPTED') { // for explorers
                res.status(422).send({message: 'Only applications with status \'DUE\' can change to \'ACCEPTED\''});

            } else if (oldTripApplication.status == 'DUE' && req.body.status == 'ACCEPTED' && !req.paidDate) { // for explorers
                res.status(422).send({message: 'When paying an application you must specify a paid date'});

            } else if (oldTripApplication.status != 'PENDING' && oldTripApplication.status != 'ACCEPTED' && req.body.status == 'CANCELLED') { // for explorers
                res.status(422).send({message: 'Only applications with status \'PENDING\' or \'ACCEPTED\' can change to \'CANCELLED\''});

            } else {
                TripApplication.findOneAndUpdate({_id: req.params.tripApplicationId}, req.body, {new: true}, function(err, newTripApplication) {
                    if (err) {
                        res.status(500).send(err);

                    } else {
                        res.json(newTripApplication);
                    }
                });
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