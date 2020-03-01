'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip');
var Utils = require('../utils');

// CRUD methods
exports.getAllTrips = function (req, res) {
    var query = Utils.computeTripsQuery(req);
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