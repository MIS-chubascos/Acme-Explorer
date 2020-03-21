var async = require("async");
var mongoose = require("mongoose"),
    DataWareHouse = mongoose.model("DataWareHouse"),
    TripApplication = mongoose.model("TripApplications"),
    Trip = mongoose.model("Trip"),
    Cube = mongoose.model("Cube"),
    Actor = mongoose.model("Actors"),
    Finder = mongoose.model('Finders'),
    Sponsorship = mongoose.model('Sponsorships'),
    Configuration = mongoose.model('Config');
var Utils = require('../utils');
const dummy = require('mongoose-dummy');
const Table = require('olap-cube').model.Table;

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
    dummies['finders'] = []
    dummies['explorers'] = []
    dummies['sponsors'] = [] 
    dummies['sponsorships'] = [] 
    dummies['tripApplications'] = []
    dummies['administrators'] = []
    dummies['configuration'] = []

    // Managers

    for(var i = 0; i < req.query.size; i++){
        let dummyManager = dummy(Actor, {
            ignore: ['actorType', 'banned', '_id', '__v'],
            returnDate: true
        })

        dummyManager._id = new mongoose.Types.ObjectId();
        dummyManager.actorType = ['MANAGER'];
        dummyManager.__v = 0;
        dummies['managers'].push(dummyManager)
    }

    // Trips

    for(var i = 0; i < req.query.size; i++){
        let dummyTrip = dummy(Trip, {
            ignore: ['pictures', 'cancelReason', 'ticker', 'manager', '_id', '__v'],
            returnDate: true
        })

        dummyTrip._id = new mongoose.Types.ObjectId();
        dummyTrip.manager = dummies['managers'][Math.floor(Math.random() * req.query.size)]['_id'];
        dummyTrip.ticker = Utils.generateTicker(dummyTrip.startDate);
        dummyTrip.cancelReason = [];
        dummyTrip.endDate.setDate(dummyTrip.startDate.getDate() + 5);
        dummyTrip.publicationDate.setDate(dummyTrip.startDate.getDate() - 3);
        dummyTrip.__v = 0;

        totalPrice = 0
        for (var j = 0; j < dummyTrip.stages.length; j++) {
            dummyTrip.stages[j].order = j;
            totalPrice += dummyTrip.stages[j].price;
        }
        dummyTrip.price = totalPrice;
        dummies['trips'].push(dummyTrip)
    }

    // Explorers

    for(var i = 0; i < req.query.size; i++) {
        let dummyExplorer = dummy(Actor, {
            ignore: ['actorType', 'banned', '_id', '__v'],
            returnDate: true
        })

        dummyExplorer._id = new mongoose.Types.ObjectId();
        dummyExplorer.actorType = ['EXPLORER'];
        dummyExplorer.__v = 0;
        dummies['explorers'].push(dummyExplorer)
    }    

    // Finders

    for(var i = 0; i < req.query.size; i++) {
        let dummyFinder = dummy(Finder, {
            ignore: ['_id', '__v'],
            returnDate: true
        })

        dummyFinder._id = new mongoose.Types.ObjectId();
        dummyFinder.maxPrice = dummyFinder.minPrice + 500;
        dummyFinder.endDate.setDate(dummyFinder.startDate.getDate() + 14);
        dummyFinder.explorer = dummies['explorers'][Math.floor(Math.random() * req.query.size)]['_id'];
        dummies['finders'].push(dummyFinder)
    }

    // TripApplications

    for(var i = 0; i < req.query.size; i++) {
        let dummyTripApplication = dummy(TripApplication, {
            ignore: ['moment', 'status', 'paidDate', '_id', 'rejectedReason', '__v'],
            returnDate: true
        })

        var trip = dummies['trips'][Math.floor(Math.random() * req.query.size) % dummies['trips'].length];

        dummyTripApplication._id = new mongoose.Types.ObjectId();
        dummyTripApplication.status = 'ACCEPTED';
        dummyTripApplication.trip = trip['_id'];
        var d = new Date();
        d.setDate(d.getDate()-40);
        dummyTripApplication.paidDate = d;
        dummyTripApplication.manager = trip['manager'];
        dummyTripApplication.explorer = dummies['explorers'][Math.floor(Math.random() * req.query.size)]['_id'];
        dummies['tripApplications'].push(dummyTripApplication)
    }

    // Sponsors

    for(var i = 0; i < req.query.size; i++) {
        let dummySponsor = dummy(Actor, {
            ignore: ['actorType', 'banned', '_id', '__v'],
            returnDate: true
        })

        dummySponsor._id = new mongoose.Types.ObjectId();
        dummySponsor.actorType = ['SPONSOR'];
        dummySponsor.__v = 0;
        dummies['sponsors'].push(dummySponsor)
    }   

    // Sponsorships

    for(var i = 0; i < req.query.size; i++){
        let dummySponsorship = dummy(Sponsorship, {
            ignore: ['banner', 'sponsor', 'trip', 'payed'],
            returnDate: true
        })

        dummySponsorship._id = new mongoose.Types.ObjectId();
        dummySponsorship.sponsor = dummies['sponsors'][Math.floor(Math.random() * req.query.size)]['_id'];
        dummySponsorship.trip = dummies['trips'][Math.floor(Math.random() * req.query.size) % dummies['trips'].length]['_id'];
        dummySponsorship.__v = 0;
        dummies['sponsorships'].push(dummySponsorship)
    }

    // Admins

    for(var i = 0; i < req.query.size; i++){
        let dummyAdministrator = dummy(Actor, {
            ignore: ['actorType', 'banned', '_id', '__v'],
            returnDate: true
        })

        dummyAdministrator._id = new mongoose.Types.ObjectId();
        dummyAdministrator.actorType = ['ADMINISTRATOR'];
        dummyAdministrator.__v = 0;
        dummies['administrators'].push(dummyAdministrator)
    }

    //Configuration (just 1)

    let dummyConfiguration = dummy(Configuration, {
        ignore: ['_id','flatRate','finderMaxResults','finderCacheTime'],
        returnDate: true
    })

    dummyConfiguration._id = new mongoose.Types.ObjectId();
    dummyConfiguration.__v = 0;
    dummyConfiguration.flatRate = 2;
    dummyConfiguration.finderMaxResult = 5;
    dummyConfiguration.finderCacheTime = 1;
    dummies['configuration'].push(dummyConfiguration);


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
    Actor.collection.insert(dummies['explorers'], function(err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    Finder.collection.insert(dummies['finders'], function(err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    TripApplication.collection.insert(dummies['tripApplications'], function(err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    Actor.collection.insert(dummies['sponsors'], function(err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    Sponsorship.collection.insert(dummies['sponsorships'], function(err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    Actor.collection.insert(dummies['administrators'], function (err, docs) {
        if (err) {
            return console.error(err);
        }
    })
    Configuration.collection.insert(dummies['configuration'], function (err, docs) {
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
var rebuildPeriod = '* */5 * * * *'; // El que se usará por defecto
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
            computeTopFinderKeywords,
            computeCube

        ], function(err, results) {
            if (err) {
                console.log("Error computing datawarehouse: " + err);

            } else {
                newDataWareHouse.avgMinMaxStdApplicationsPerTrip = results[0];
                newDataWareHouse.ratioApplicationsByStatus = results[1];
                newDataWareHouse.avgMinMaxStdTripsPerManager = results[2];
                newDataWareHouse.avgMinMaxStdTripsPrice = results[3];
                newDataWareHouse.avgPriceRangeFinders = results[4];
                newDataWareHouse.topFinderKeywords = results[5];

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
        if (res[0]) {
            callback(err, [res[0].avgApplicationsPerTrip, res[0].minApplicationsPerTrip, res[0].maxApplicationsPerTrip, res[0].stdApplicationsPerTrip]);

        } else {
            callback(err, []);
        }
    });
};

function computeRatioApplicationsByStatus (callback) {
    TripApplication.aggregate([
        {$facet: {
            totalSum: [{$group: {_id: null, totalSum: {$sum: 1}}}],
            pendingSum: [{$match: {status: "PENDING"}}, {$group: {_id: "$status", pendingSum: {$sum: 1}}}],
            dueSum: [{$match: {status: "DUE"}}, {$group: {_id: "$status", dueSum: {$sum: 1}}}],
            acceptedSum: [{$match: {status: "ACCEPTED"}}, {$group: {_id: "$status", acceptedSum: {$sum: 1}}}],
            cancelledSum: [{$match: {status: "CANCELLED"}}, {$group: {_id: "$status", cancelledSum: {$sum: 1}}}],
            rejectedSum: [{$match: {status: "REJECTED"}}, {$group: {_id: "$status", rejectedSum: {$sum: 1}}}]
        }},
        {$project: {
            _id: 0, 
            pendingRatio: {$divide: [{$arrayElemAt: ["$pendingSum.pendingSum", 0]}, {$arrayElemAt: ["$totalSum.totalSum", 0]}]},
            dueRatio: {$divide: [{$arrayElemAt: ["$dueSum.dueSum", 0]}, {$arrayElemAt: ["$totalSum.totalSum", 0]}]},
            acceptedRatio: {$divide: [{$arrayElemAt: ["$acceptedSum.acceptedSum", 0]}, {$arrayElemAt: ["$totalSum.totalSum", 0]}]},
            cancelledRatio: {$divide: [{$arrayElemAt: ["$cancelledSum.cancelledSum", 0]}, {$arrayElemAt: ["$totalSum.totalSum", 0]}]},
            rejectedRatio: {$divide: [{$arrayElemAt: ["$rejectedSum.rejectedSum", 0]}, {$arrayElemAt: ["$totalSum.totalSum", 0]}]}
        }}

    ], function(err, res) {
        if (res[0]) {
            callback(err, res[0].pendingRatio, res[0].dueRatio, res[0].acceptedRatio, res[0].cancelledRatio, res[0].rejectedRatio);

        } else {
            callback(err, []);
        }
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
        if (res[0]) {
            callback(err, [res[0].avgTripsPerManager, res[0].minTripsPerManager, res[0].maxTripsPerManager, res[0].stdTripsPerManager]);
        } else {
            callback(err, []);
        }
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
        if (res[0]) {
            callback(err, [res[0].avgTripsPrice, res[0].minTripsPrice, res[0].maxTripsPrice, res[0].stdTripsPrice]);

        } else {
            callback(err, []);
        }
    });
};

function computeAvgPriceRangeFinders (callback) {
    Finder.aggregate([
        {$group: {_id: 0, avgMinPrice: {"$avg": "$minPrice"}, avgMaxPrice: {"$avg": "$maxPrice"}}},

    ], function(err, res) {
        if (res[0]) {
            callback(err, [res[0].avgMinPrice, res[0].avgMaxPrice]);
        } else {
            callback(err, []);
        }
    });
};

function computeTopFinderKeywords (callback) {
    Finder.aggregate([
        {$match: {keyword: {$exists: true}}},
        {$group: {_id: "$keyword", total: {$sum: 1}}},
        {$sort: {"total": -1}},
        {$limit: 10}

    ], function(err, res) {
        if (res[0]) {
            callback(err, res[0]._id);
        } else {
            callback(err, []);
        }
    });
};

async function computeCube () {
    tripAppsByPeriod = []

    // Months
    for (var i = 1; i < 37; i++) {
        period = "M"
        if (i < 10) {
            period += "0" + i;

        } else {
            period += i;
        }
        var initialDate = new Date();
        initialDate.setMonth(initialDate.getMonth - i);

        tripAppsByPeriod.push(TripApplication.aggregate([
            {$match: {status: "ACCEPTED", paidDate: {$gte: initialDate}}},
            {$group: {_id: "$explorer", trips: {$push: "$trip"}}},
            {$project: {_id: "$_id", trips: "$trips", period: period}}
        ]).exec());
    }

    // Years
    for (var i = 1; i < 4; i++) {
        period = "Y0" + i
    
        var initialDate = new Date();
        initialDate.setMonth(initialDate.getFullYear - i);

        tripAppsByPeriod.push(TripApplication.aggregate([
            {$match: {status: "ACCEPTED", paidDate: {$gte: initialDate}}},
            {$group: {_id: "$explorer", trips: {$push: "$trip"}}},
            {$project: {_id: "$_id", trips: "$trips", period: period}}
        ]).exec());
    }

    // Solve promises
    Promise.all(tripAppsByPeriod).then((obtainedTripAppsByPeriod) => { // All the applications for every month [{explorer, trips, period}]
        var tripsByTripApps = []
        obtainedTripAppsByPeriod.map((tripApplications, index) => {  // All the applications for one month [{explorer, trips}]
            tripApplications.map((tripApplication) => { // {explorer, trips}
                tripsByTripApps.push(Trip.aggregate([
                    {$match: {_id: {$in: tripApplication.trips}}},
                    {$group: {_id: tripApplication._id, money: {$sum: "$price"}}},
                    {$project: {_id: tripApplication._id, money: "$money", period: tripApplication.period}}
                ]).exec())
            });
            Promise.all(tripsByTripApps).then((result) => {
                result.map((res) => {
                    var cube_data = {"explorer": res[0]._id, "money": res[0].money, "period": res[0].period}
                    Cube.find({"explorer": res[0]._id, "period": res[0].period}, function(err, cube) {
                        if (cube.length <= 0){
                            var new_cube = new Cube(cube_data)
                            new_cube.save(function(err, cube) {
                            });
                        } else if (cube[0].money != res[0].money) {
                            cube[0].money = res[0].money;
                            cube[0].save(function(err, cube) {
                            });
                        }
                    })
                })
            });
        });
    });
}

function validatePeriod(string) {
    return /^M0[1-9]|M1[0-9]|M2[0-9]|M3[0-6]|Y0[1-3]$/.test(string);
}

function validateComparator(string) {
    return /^==|!=|>|>=|<|<=$/.test(string);
}

exports.getCube = function(req, res) {

    if (req.query.period && req.query.explorerId && validatePeriod(req.query.period)) {
        Cube.findOne({explorer: req.query.explorerId, period: req.query.period}, function(err, cube) {
            if (err) {
                res.status(500).send(err);
    
            } else if (!cube) {
                res.status(404).send({message: "No data found for the given params."});
            
            } else {
                res.json(cube);
            }
        });

    } else {
        res.status(422).send({message: "Invalid period format."})
    }
};

exports.getCubeAdvanced = async function (req, res) {

    if (req.query.period && req.query.comparator && req.query.value && validatePeriod(req.query.period) && validateComparator(req.query.comparator)) {
        const table = new Table({
            dimensions: ['period', 'explorer'],
            fields: ['money'],
        });

        Cube.find({period: req.query.period}, function (err, results) {
            if (err) {
                res.status(500).send(err);

            } else if (!results) {
                res.status(404).send({message: "No cube found."});

            } else {
                rows = []
                results.map((row) => {
                    rows.push([row.period, row.explorer, row.money])
                });

                const table2 = table.addRows({
                    header: ['period', 'explorer', 'money'],
                    rows: rows
                });

                explorers = table2.rows
                    .filter(row => eval(row[2] + req.query.comparator + req.query.value))
                    .flatMap(row => {
                        return {
                            period: row[0],
                            explorer: row[1],
                            money: row[2]
                        }
                    });

                res.json(explorers);
            }
        });

    } else {
        res.status(422).send({message: "Invalid period format."})
    }
}