'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip');

exports.getAllTrips = function (req, res) {
    Trip.find({}, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
}

exports.searchTrips = function (req, res) { // Logic will be implemented in next deliverable
    Trip.find({}, function (err, trips) {
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

exports.getTripApplications = function (req, res) { // Logic will be implemented in next deliverable
    Trip.findById(req.params.tripId, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
}

exports.createTrip = function (req, res) {
    var newTrip = new Trip(req.body);
    newTrip.save(function (err, trip) {
        if (err) {
            res.send(err);
        } else {
            res.json(trip)
        }
    })
}

exports.updateTrip = function (req, res) {
    Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true, runValidators: true, context: 'query' }, function (err, trip) {
        if (err) {
            res.send(err);
        } else {
            res.json(trip)
        }
    })
}

exports.deleteTrip = function (req, res) {
    Trip.findOneAndDelete({ _id: req.params.tripId }, function (err, trip) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Trip successfully removed.'})
        }
    })
}





exports.createTripApplication = function(req, res) {
    //Check if the user is an explorer and if not: res.status(403); "only explorers can create applications"

    var newTripApplication = new TripApplication();
    newTripApplication.comments = req.body.comments;
    newTripApplication.trip = req.params.tripId;
    //newTripApplication.explorer = explorerId //Set explorer id

    Trip.findById(req.params.tripId, function(err, trip) {
        if (err) {
            res.status(500).send(err);

        } else {
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
        }
    });
};