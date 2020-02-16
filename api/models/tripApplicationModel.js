'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderSchema = new Schema({

    moment: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        required: 'Kindly enter the application status',
        enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED'],
        default: 'PENDING'
    },

    comments: {
        type: String,
    },

    paidDate: {
        type: Date
    },

    rejectedReason: {
        type: String,
        validate: {
            validator: function (rejectedReason) {
                res = true;

                if (rejectedReason && !this.status == 'REJECTED') {
                    res = false;
                }
                
                return res;
            },

            message: 'Can\'t specify a rejected reason if the application is not rejected'
        },
    },

    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
    },

    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },

}, {strict: false});

module.exports = mongoose.model('Finders', FinderSchema);