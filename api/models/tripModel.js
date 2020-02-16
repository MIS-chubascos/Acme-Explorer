var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
}, {strict: false})

var TripSchema = new Schema({
    ticker : {
        type: String,
        required: 'Kindly enter the ticker of the trip',
        unique: true,
        validate: {
            validator: function (v) {
                return /^([12]\d{1}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))-[A-Z]{4}$/.test(v);
            },
            message: 'Ticker format is not valid. Must follow the pattern YYMMDD-XXXX'
        }
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
        required: 'Kindly enter the password of the trip',
        min: 0,
        default: function() {
            var price = 0;
            for (index in this.stages) {
                stage = this.stages[index]
                price += stage.price
            }
            return price;
        }
    },
    requirements : [{
        type: String,
        required: 'Kindly enter the requirements of the trip',
        
    }],
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
    isCancelled: {
        type: Boolean,
        default: false,
        validate: {
            validator: function (isCancelled) {
                if (isCancelled && !this.cancelReason) {
                    return false
                }
                return true
            },
            message: 'If the trip is cancelled, cancel reason must be provided'
        },
    },
    cancelReason: {
        type: String,
        validate: {
            validator: function (cancelReason) {
                if (cancelReason && !this.isCancelled) {
                    return false
                }
                return true
            },
            message: 'Can\'t specify cancel reason if the trip is not cancelled'
        },
    },
    pictures: [{
        type: Buffer,
    }],
    createdAt : {
        type: Date,
        default: Date.now
    }
}, {strict: false})

TripSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true
    next()
})

module.exports = mongoose.model('Trip', TripSchema);