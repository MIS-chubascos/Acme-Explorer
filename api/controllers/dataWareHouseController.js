var async = require("async");
var mongoose = require("mongoose"),
    DataWareHouse = mongoose.model("DataWareHouse"),
    TripApplication = mongoose.model("TripApplications");

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
            computeRatioApplicationsByStatus

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