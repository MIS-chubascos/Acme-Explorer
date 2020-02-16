'use strict';

var mongoose = require('mongoose'),
Finder = mongoose.model('Finders');

exports.getAllFinders = function(req, res) {
    Finder.find(function(err, finders) {
        if (err) {
            res.send(err);

        } else {
            res.send(finders);
        }
    });
};

exports.getFinder = function(req, res) {
    Finder.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.send(err);

        } else {
            res.json(finder);
        }
    });
};

exports.createFinder = function(req, res) {
    var newFinder = new Finder();

    newFinder.lastSearchDate = Date.now();

    newFinder.save(function(err, finder) {
        if (err) {
            res.send(err);

        } else {
            res.json(finder);
        }
    });
};

exports.updateFinder = function(req, res) {
    req.body.lastSearchDate = Date.now();

    Finder.findOneAndUpdate({_id: req.params.finderId}, req.body, {new: true}, function(err, finder) {
        if (err) {
            res.send(err);

        } else {
            res.json(finder);
        }
    });
};

exports.deleteFinder = function(req, res) {
    Finder.remove({_id: req.params.finderId}, function(err, finder) {
        if (err) {
            res.send(err);

        } else {
            res.json({message: 'Finder successfully deleted'})
        }
    });
};





exports.getTripsByFinder = function(req, res) { // Logic will be implemented in next deliverable
    Finder.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.send(err);

        } else {
            res.json(finder);
        }
    });
};