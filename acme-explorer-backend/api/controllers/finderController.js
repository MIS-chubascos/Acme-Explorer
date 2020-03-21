'use strict';

var mongoose = require('mongoose'),
cache = require('memory-cache'),
Finder = mongoose.model('Finders'),
Config = mongoose.model('Config');
var tripController = require('./tripController');
var authController = require('./authController');

exports.getFinderV1 = function(req, res) {
    Finder.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.status(500).send(err);
        
        } else if (!finder) {
            res.status(404).send({message: "No finder found for the given ID"});

        } else {
            res.json(finder);
        }
    });
};

exports.getFinderV2 = async function(req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    Finder.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.status(500).send(err);

        } else if (!finder) {
            res.status(404).send({message: "No finder found for the given ID"});

        } else {
            if (authenticatedActorId == finder.explorer) {
                res.json(finder);

            } else {
                res.status(403).send({message: 'You can only display your own finder.'});
            }
        }
    });
};

exports.updateFinderV1 = function(req, res) {
    Finder.findOneAndUpdate({_id: req.params.finderId}, req.body, {new: true}, function(err, finder) {
        if (err) {
            res.status(500).send(err);
        
        } else if (!finder) {
            res.status(404).send({message: "No finder found for the given ID"});

        } else {
            cache.del("tripsByFinder");
            res.json(finder);
        }
    });
};

exports.updateFinderV2 = async function(req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.explorer) {
        Finder.findOneAndUpdate({_id: req.params.finderId}, req.body, {new: true}, function(err, finder) {
            if (err) {
                res.status(500).send(err);

            } else if (!finder) {
                res.status(404).send({message: "No finder found for the given ID"});

            } else {
                cache.del("tripsByFinder");
                res.json(finder);
            }
        });

    } else {
        res.status(403).send({message: 'You can only update your own finder.'});
    }
};

exports.getTripsByFinderV1 = async function(req, res) {
    var config = await Config.findOne({}).exec();
    var finder = await Finder.findById(req.params.finderId).exec();
    var cachedResults = cache.get("tripsByFinder");

    if (!finder) {
        res.status(404).send({message: "No finder found for the given ID"});

    } else if (!cachedResults) {
        var finderResults = await tripController.searchTrips(finder.keyword, finder.minPrice, finder.maxPrice, finder.startDate, finder.endDate);
        cache.put("tripsByFinder", finderResults, config.finderCacheTime * 3600000);
        res.json(finderResults.slice(0, config.finderMaxResults));
        
    } else {
        res.json(cachedResults.slice(0, config.finderMaxResults));
    }
};

exports.getTripsByFinderV2 = async function(req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    var config = await Config.findOne({}).exec();
    var finder = await Finder.findById(req.params.finderId).exec();
    var cachedResults = cache.get("tripsByFinder");

    if (!finder) {
        res.status(404).send({message: "No finder found for the given ID"});

    } else if (authenticatedActorId == finder.explorer) {
        if (!cachedResults) {
            var finderResults = await tripController.searchTrips(finder.keyword, finder.minPrice, finder.maxPrice, finder.startDate, finder.endDate);
            cache.put("tripsByFinder", finderResults, config.finderCacheTime * 3600000);
            res.json(finderResults.slice(0, config.finderMaxResults));
            
        } else {
            res.json(cachedResults.slice(0, config.finderMaxResults));
        }
    
    } else {
        res.status(403).send({message: 'You can only make searchs with your own finder.'});
    }
};





exports.createFinder = function(explorerId) {
    var newFinder = new Finder();
    newFinder.explorer = explorerId;

    newFinder.save(function(err, finder) {
        return finder;
    });
};

exports.deleteFinder = function(explorerId) {
    Finder.remove({explorer: explorerId}, function(err, finder) {});
};