'use strict';
var mongoose = require('mongoose');

var DataWareHouseSchema = new mongoose.Schema({

    // TripApplication
    avgMinMaxStdApplicationsPerTrip: [{
        type: Number
    }],

    ratioApplicationsByStatus: [{
        type: Number,
        max: 1,
        min: 0
    }],

    // Trip
    avgMinMaxStdTripsPerManager: [{
        type: Number,
        min: 0
    }],
    avgMinMaxStdTripsPrice: [{
        type: Number,
        min: 0
    }],

    // Finder
    avgPriceRangeFinders: [{
        type: Number,
        min: 0
    }],

    topFinderKeywords: [{
        type: String
    }],
    
    // Metadata
    computationMoment: {
        type: Date,
        default: Date.now
    },

    rebuildPeriod: {
        type: String
    }

}, { strict: false });

DataWareHouseSchema.index({computationMoment: -1});

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);