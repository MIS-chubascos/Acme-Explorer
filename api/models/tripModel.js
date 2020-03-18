var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Utils = require('../utils');

var StageSchema = new Schema({
    title : {
        type: String,
        required: 'Kindly enter the title of the stage',
        
    },
    description : {
        type: String,
        required: 'Kindly enter the description of the stage',
    },
    price : {
        type: Number,
        required: 'Kindly enter the price of the stage',
        min: 0
    },
    order : {
        type: Number,
        required: 'Kindly enter the order of the stage',
        min: 0
    },
}, {strict: false})

var TripSchema = new Schema({
    ticker : {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^([12]\d{1}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))-[A-Z]{4}$/.test(v);
            },
            message: 'Ticker format is not valid. Must follow the pattern YYMMDD-XXXX'
        },
        default: function() {
            var price = 0;
            for (index in this.stages) {
                stage = this.stages[index]
                price += stage.price
            }
            return price;
        }
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },
    title : {
        type: String,
        required: 'Kindly enter the title of the trip',
        
    },
    description : {
        type: String,
        required: 'Kindly enter the description of the trip',
    },
    stages : [{
        type: StageSchema,
        required: 'Kindly enter the stages of the trip',
    }],
    price : {
        type: Number,
        required: 'Kindly enter the price of the trip',
        min: 0
    },
    requirements : {
        type: String,
        required: 'Kindly enter the requirements of the trip',
        
    },
    publicationDate : {
        type: Date,
        required: 'Kindly enter the publication date of the trip',
        validate: {
            validator: function (publicationDate) {
                if (publicationDate >= new Date() && publicationDate < this.startDate) {
                    return true
                }
                return false
            },
            message: 'Publication date must be after the current date and after the start date'
        },
    },
    startDate : {
        type: Date,
        required: 'Kindly enter the start date of the trip',
        validate: {
            validator: function (startDate) {
                if (startDate > new Date()) {
                    return true
                }
                return false
            },
            message: 'Start date must be after the current date'
        },
    },
    endDate : {
        type: Date,
        required: 'Kindly enter the end date of the trip',
        validate: {
            validator: function (endDate) {
                if (endDate >= this.startDate) {
                    return true
                }
                return false
            },
            message: 'End date must be after the start date'
        },
        
    },
    cancelReason: {
        type: String,
    },
    pictures: [{
        type: Buffer,
    }],
    createdAt : {
        type: Date,
        default: Date.now
    }
}, {strict: false, collection: 'trips'})

TripSchema.index({ ticker: 'text', title: 'text', description: 'text' });
TripSchema.index({ price: 1, startDate: 1, endDate:1 });

TripSchema.pre('validate', async function (next) {
    // Generate ticker
    while (true) {
        ticker = Utils.generateTicker(new Date());
        exists = await this.constructor.exists({ 'ticker': ticker });
        if (!exists) {
            this.ticker = ticker;
            break;
        }
    }
    next();
})

TripSchema.pre('save', function (next) {
    var price = 0;
    for (index in this.stages) {
        stage = this.stages[index]
        price += stage.price
    }
    this.price = price;
    next()
})
module.exports = mongoose.model('Trip', TripSchema);