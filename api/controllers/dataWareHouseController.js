var async = require("async");
var mongoose = require("mongoose"),
    DataWareHouse = mongoose.model("DataWareHouse"),
    TripApplication = mongoose.model("TripApplications");
    Trip = mongoose.model("Trip");
    Actor = mongoose.model("Actors");
    Finder = mongoose.model('Finders');
var Utils = require('../utils');
const dummy = require('mongoose-dummy');

exports.listAllIndicators = function(req, res) {
    console.log("Requesting indicators");

    DataWareHouse.find().sort("-computationMoment").exec(function(err, indicators) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json(indicators);
        }
    });
};

exports.lastIndicator = function(req, res) {
    DataWareHouse.find().sort("-computationMoment").limit(1).exec(function(err, indicator) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.json(indicator);
        }
    });
};

exports.populate = function (req, res) {
    var dummies = {}
    dummies['trips'] = []
    dummies['managers'] = []
    for(var i = 0; i < req.query.size; i++){
        let dummyManager = dummy(Actor, {
            ignore: ['actorType', 'banned'],
            returnDate: true
        })

        dummyManager.actorType = ['MANAGER'];
        dummies['managers'].push(dummyManager)
    }
    for(var i = 0; i < req.query.size; i++){
        let dummyTrip = dummy(Trip, {
            ignore: ['pictures', 'cancelReason', 'ticker', 'manager'],
            returnDate: true
        })

        dummyTrip.manager = dummies['managers'][Math.floor(Math.random() * req.query.size)]['_id'];
        dummyTrip.ticker = Utils.generateTicker(dummyTrip.startDate);
        dummyTrip.cancelReason = [];
        dummyTrip.endDate.setDate(dummyTrip.startDate.getDate() + 5);
        dummyTrip.publicationDate.setDate(dummyTrip.startDate.getDate() + 1);
        dummies['trips'].push(dummyTrip)
    }

    Actor.collection.insert(dummies['managers'], function (err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    Trip.collection.insert(dummies['trips'], function (err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    res.json(dummies);
}





var CronJob = require("cron").CronJob;
var CronTime = require("cron").CronTime;

// '0 0 * * * *' una hora
// '*/30 * * * * *' cada 30 segundos
// '*/10 * * * * *' cada 10 segundos
// '* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *'; // El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function(req, res) {
    console.log("Updating rebuild period. Request: period: " + req.query.rebuildPeriod);
    
    rebuildPeriod = req.query.rebuildPeriod;
    computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
    computeDataWareHouseJob.start();

    res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob() {
    computeDataWareHouseJob = new CronJob(rebuildPeriod, function() {
        var newDataWareHouse = new DataWareHouse();
        console.log("Cron job submitted. Rebuild period: " + rebuildPeriod);

        async.parallel([
            computeAvgMinMaxStdApplicationsPerTrip,
            computeRatioApplicationsByStatus,
            computeAvgMinMaxStdTripsPerManager,
            computeAvgMinMaxStdTripsPrice,
            computeAvgPriceRangeFinders,
            computeTopFinderKeywords

        ], function(err, results) {
            if (err) {
                console.log("Error computing datawarehouse: " + err);

            } else {
                newDataWareHouse.avgMinMaxStdApplicationsPerTrip = results[0];
                newDataWareHouse.ratioApplicationsByStatus = results[1];

                newDataWareHouse.save(function(err, datawarehouse) {
                    if (err) {
                        console.log("Error saving datawarehouse: " + err);

                    } else {
                        console.log("New datawarehouse successfully saved. Date: " + new Date());
                    }
                });
            }
        });
    }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

function computeAvgMinMaxStdApplicationsPerTrip (callback) {
    TripApplication.aggregate([
        {$group: {_id: "$trip", applications: {$sum: 1}}},
        {$group: {
            _id: 0, 
            avgApplicationsPerTrip: {"$avg": "$applications"},
            minApplicationsPerTrip: {"$min": "$applications"},
            maxApplicationsPerTrip: {"$max": "$applications"},
            stdApplicationsPerTrip: {"$stdDevPop": "$applications"}
        }}
    ], function(err, res) {
        callback(err, [res[0].avgApplicationsPerTrip, res[0].minApplicationsPerTrip, res[0].maxApplicationsPerTrip, res[0].stdApplicationsPerTrip])
    });
};

function computeRatioApplicationsByStatus (callback) {
    TripApplication.aggregate([
        {$facet: {
            totalSum: [{$group: {_id: null, totalSum: {$sum: 1}}}],
            statusSum: [{$group: {_id: "$status", statusSum: {$sum: 1}}}]
        }},
        {$project: {_id: 0, totalSum: "$totalSum.totalSum", statusSum: "$statusSum.statusSum"}},
        {$unwind: "$totalSum"}, {$unwind: "$statusSum"},
        {$project: {_id:0, status: "$statusSum._id", ratio: {$divide: ["$statusSum.statusSum", "$totalSum.totalSum"]}}},
        {$unwind: "$status"},
        {$group: {_id: null}, ratioApplicationsByStatus: {$push: {status: "$status", ratio: "$ratio"}}}

    ], function(err, res) {
        callback(err, res[0].ratioApplicationsByStatus)
    });
};

function computeAvgMinMaxStdTripsPerManager (callback) {
    Trip.aggregate([
        {$group: {_id: "$manager", tripsPerManager: {$sum: 1}}},
        {$group: {
            _id: 0, 
            avgTripsPerManager: {"$avg": "$tripsPerManager"},
            minTripsPerManager: {"$min": "$tripsPerManager"},
            maxTripsPerManager: {"$max": "$tripsPerManager"},
            stdTripsPerManager: {"$stdDevPop": "$tripsPerManager"}
        }}
    ], function(err, res) {
        callback(err, [res[0].avgTripsPerManager, res[0].minTripsPerManager, res[0].maxTripsPerManager, res[0].stdTripsPerManager])
    });
};

function computeAvgMinMaxStdTripsPrice (callback) {
    Trip.aggregate([
        {$group: {
            _id: 0, 
            avgTripsPrice: {"$avg": "$price"},
            minTripsPrice: {"$min": "$price"},
            maxTripsPrice: {"$max": "$price"},
            stdTripsPrice: {"$stdDevPop": "$price"}
        }}
    ], function(err, res) {
        callback(err, [res[0].avgTripsPrice, res[0].minTripsPrice, res[0].maxTripsPrice, res[0].stdTripsPrice])
    });
};

function computeAvgPriceRangeFinders (callback) {
    Finder.aggregate([
        {$group: {_id: 0, avgMinPrice: {"$avg": "$minPrice"}, avgMaxPrice: {"$avg": "$maxPrice"}}},

    ], function(err, res) {
        callback(err, [res[0].avgMinPrice, res[0].avgMaxPrice])
    });
};

function computeTopFinderKeywords (callback) {
    Finder.aggregate([
        {$match: {keyword: {$exists: true}}},
        {$group: {_id: "$keyword", total: {$sum: 1}}},
        {$sort: {"total": -1}},
        {$limit: 10}

    ], function(err, res) {
        callback(err, res[0]._id)
    });
};