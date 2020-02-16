'use strict';

var mongoose = require('mongoose'),
TripApplication = mongoose.model('TripApplications');

exports.getAllTripApplications = function(req, res) {
    TripApplication.find(function(err, tripApplications) {
        if (err) {
            res.send(err);

        } else {
            res.send(tripApplications);
        }
    });
};

exports.getTripApplication = function(req, res) {
    TripApplication.findById(req.params.tripApplicationId, function(err, tripApplication) {
        if (err) {
            res.send(err);

        } else {
            res.json(tripApplication);
        }
    });
};

exports.createTripApplication = function(req, res) {
    var newTripApplication = new TripApplication(req.body);

    newTripApplication.save(function(err, tripApplication) {
        if (err) {
            res.send(err);

        } else {
            res.json(tripApplication);
        }
    });
};

exports.updateTripApplication = function(req, res) {
    TripApplication.findOneAndUpdate({_id: req.params.tripApplicationId}, req.body, {new: true}, function(err, tripApplication) {
        if (err) {
            res.send(err);

        } else {
            res.json(tripApplication);
        }
    });
};

exports.deleteTripApplication = function(req, res) {
    TripApplication.remove({_id: req.params.tripApplicationId}, function(err, tripApplication) {
        if (err) {
            res.send(err);

        } else {
            res.json({message: 'Trip aplication successfully deleted'})
        }
    });
};





exports.getRatioByStatus = function(req, res) { // Logic will be implemented in next deliverable
    TripApplication.find(function(err, tripApplications) {
        if (err) {
            res.send(err);

        } else {
            res.send(tripApplications);
        }
    });
};