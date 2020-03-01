'use strict';
var mongoose = require('mongoose');

var DataWareHouseSchema = new mongoose.Schema({

    avgMinMaxStdApplicationsPerTrip: [{
        type: Number
    }],

    ratioApplicationsByStatus: [{
        type: Number,
        max: 1,
        min: 0
    }],

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