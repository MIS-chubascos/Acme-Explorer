'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderSchema = new Schema({

    keyword: {
        type: String
    },

    minPrice: {
        type: Number,
        min: 0,
        validate: {
            validator: function (minPrice) {
                res = true

                if (this.maxPrice) {
                    res = minPrice <= this.maxPrice;
                }

                return res;
            },

            message: 'The minimum price must be lower than the maximum price'
        },
    },

    maxPrice: {
        type: Number,
        min: 0,
        validate: {
            validator: function (maxPrice) {
                res = true

                if (this.minPrice) {
                    res = this.minPrice <= maxPrice;
                }

                return res;
            },

            message: 'The maximum price must be higher than the minimum price'
        },
    },

    startDate: {
        type: Date,
        validate: {
            validator: function (startDate) {
                res = true

                if (this.endDate) {
                    res = startDate <= this.endDate;
                }

                return res;
            },

            message: 'The starting date must be before the ending date'
        },
    },

    endDate: {
        type: Date,
        validate: {
            validator: function (endDate) {
                res = true

                if (this.startDate) {
                    res = this.startDate <= endDate;
                }

                return res;
            },

            message: 'The ending date must be after the starting date'
        },
    },

    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    }

}, {strict: false});

module.exports = mongoose.model('Finders', FinderSchema);