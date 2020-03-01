'use strict';

var mongoose = require('mongoose'),
cache = require('memory-cache'),
Finder = mongoose.model('Finders'),
Config = mongoose.model('Config');
var TripController = require('./tripController');

exports.getAllFinders = function(req, res) {
    Finder.find(function(err, finders) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(finders);
        }
    });
};

exports.getFinder = function(req, res) {
    //Check if the user is an explorer and if not: res.status(403); "only explorers can display finders"
    //Check if the user is an explorer and the finder is hers and if not: res.status(403); "explorers can only display their own finder"
    Finder.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json(finder);
        }
    });
};

exports.createFinder = function(req, res) {
    var newFinder = new Finder();

    newFinder.save(function(err, finder) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);

            } else {
                res.status(500).send(err);
            }

        } else {
            res.json(finder);
        }
    });
};

exports.updateFinder = function(req, res) {
    //Check if the user is an explorer and if not: res.status(403); "only explorers can display finders"
    //Check if the user is an explorer and the finder is hers and if not: res.status(403); "explorers can only display their own finder"

    Finder.findOneAndUpdate({_id: req.params.finderId}, req.body, {new: true}, function(err, finder) {
            if (err) {
                res.status(500).send(err);

            } else {
                cache.del("tripsByFinder");
                res.json(finder);
            }
    });
};

exports.deleteFinder = function(req, res) {
    Finder.remove({_id: req.params.finderId}, function(err, finder) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json({message: 'Finder successfully deleted'})
        }
    });
};





exports.getTripsByFinder = async function(req, res) { 
    //Check if the user is an explorer and if not: res.status(403); "only explorers can use finders"
    //Check if the user is an explorer and the finder is hers and if not: res.status(403); "explorers can only use their own finder"

    var config = await Config.findOne({}).exec();
    var finder = await Finder.findById(req.params.finderId).exec();
    var cachedResults = cache.get("tripsByFinder");

    if (!cachedResults) {
        var finderResults = await TripController.searchTrips(finder.keyword, finder.minPrice, finder.maxPrice, finder.startDate, finder.endDate);
        cache.put("tripsByFinder", finderResults, config.finderCacheTime * 3600000);
        res.json(finderResults.slice(0, config.finderMaxResults));
        
    } else {
        res.json(cachedResults.slice(0, config.finderMaxResults));
    }
};