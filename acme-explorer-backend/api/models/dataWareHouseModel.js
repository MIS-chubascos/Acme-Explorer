'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var CubeSchema = new mongoose.Schema({
    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    },
    period: {
        type: String,
        validate: {
            validator: function (period) {
                return /^M0[1-9]|M1[0-9]|M2[0-9]|M3[0-6]|Y0[1-3]$/.test(period);
            },

            message: 'Invalid period, it must be M01-M36 or Y01-Y03.'
        },
        required: true
    },
    money: {
        type: Number,
        min: 0,
        required: true
    }

}, {strict: false});

CubeSchema.index({ explorer: 1, period: 1, money: 1 }, {unique:true});
DataWareHouseSchema.index({computationMoment: -1});

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
module.exports = mongoose.model('Cube', CubeSchema);