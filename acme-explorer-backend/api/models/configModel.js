'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    flatRate: {
        type: Number,
        min: 0, 
        required: 'Please enter a flat rate'
    },
    finderMaxResults: {
        type: Number,
        min: 1,
        max: 100, 
        default: 10
    },
    finderCacheTime: { //on hours
        type: Number,
        min: 1,
        max: 24,
        default: 1
    }
}, 
    { strict: false}); //Can receive things not shaped as model

module.exports = mongoose.model('Config', ConfigSchema);
