'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip');
var Utils = require('../utils');
var authController = require('./authController');
var actorController = require('./actorController');
var tripApplicationController = require('./tripApplicationController');

// CRUD methods
exports.getAllTrips = function (req, res) {
    var query = {}
    if (req.query.k) {
        query['$text'] = { $search: keyword };
    }
    Trip.find(query, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
}

exports.getTrip = function (req, res) {
    Trip.findById(req.params.tripId, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
}

exports.getTripApplications = function (req, res) {
    Trip.findById(req.params.tripId, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
}

exports.createTrip = async function (req, res) {
    var newTrip = new Trip(req.body);
    newTrip.save(function (err, trip) {
        if (err) {
            res.send(err);
        } else {
            res.json(trip)
        }
    })
}

exports.updateTrip = async function (req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.manager) {
        Trip.findById(req.params.tripId, function (err, trip) {
            if (err) {
                res.send(err);
            } else if (trip.publicationDate <= new Date() ) {
                res.status(403);
                res.json({message: 'Forbidden. The trip is already published.', error: err});
            } else {
                var updatedTrip = req.body;
                trip.title = updatedTrip.title;
                trip.description = updatedTrip.description;
                trip.requirements = updatedTrip.requirements;
                trip.pictures = updatedTrip.pictures;
                trip.stages = updatedTrip.stages;
                trip.startDate = updatedTrip.startDate;
                trip.endDate = updatedTrip.endDate;
                trip.publicationDate = updatedTrip.publicationDate;
                trip.cancelReason = updatedTrip.cancelReason;
                trip.save(function (error, newTrip) {
                    if (error) {
                        res.send(error);
                    }
                    else {
                        res.json(newTrip);
                    }
                });
                
            }
        })
    } else {
        res.status(403);
        res.json({message: 'Forbidden. More privileges are required.',error: err});
    }
}

exports.deleteTrip = async function (req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.manager) {
        Trip.findById(req.params.tripId, function (err, trip) {
            if (err) {
                res.send(err);
            } else if (trip.publicationDate <= new Date() ) {
                res.status(403);
                res.json({message: 'Forbidden. The trip is already published.',error: err});
            } else {
                Trip.findOneAndDelete({ _id: req.params.tripId }, function (err, trip) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({ message: 'Trip successfully removed.' })
                    }
                })
            }
        });
    } else {
        res.status(403);
        res.json({message: 'Forbidden. More privileges are required.',error: err});
    }
}


exports.createTripApplication = async function (req, res) {

    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    var newTripApplication = new TripApplication();
    newTripApplication.comments = req.body.comments;
    newTripApplication.trip = req.params.tripId;
    newTripApplication.explorer = authenticatedActorId;

    Trip.findById(req.params.tripId, function (err, trip) {
        if (err) {
            res.status(500).send(err);

        } else {
            var now = new Date();

            if (trip.publicationDate > now) {
                res.status(422).send({ message: 'The corresponding trip has not been published yet' });

            } else if (trip.startDate < now) {
                res.status(422).send({ message: 'The corresponding trip has already started' });

            } else if (trip.cancelReason) {
                res.status(422).send({ message: 'The corresponding trip is cancelled' })

            } else {
                newTripApplication.save(function (err, tripApplication) {
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
        }
    });
};

// Other methods
exports.cancelTrip = async function (req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.manager) {
        Trip.findById(req.params.tripId, function (err, trip) {
            if (err) {
                res.send(err);
            } else if (trip.startDate <= new Date() 
                && tripApplicationController.getAcceptedTripApplications(req.params.tripId) <= 0) { 
                res.json({message: 'Forbidden. The trip has started.',error: err});
            } else {
                Trip.findOneAndDelete({ _id: req.params.tripId }, function (err, trip) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({ message: 'Trip successfully removed.' })
                    }
                })
            }
        });
    } else {
        res.status(403);
        res.json({message: 'Forbidden. More privileges are required.',error: err});
    }
}

exports.searchTrips = function (keyword, minPrice, maxPrice, startDate, endDate) {
    var query = Utils.computeTripsQuery(keyword, minPrice, maxPrice, startDate, endDate);
    Trip.find(query, function (err, trips) {
        return trips;
    })
}