var mongoose = require('mongoose');
require('mongoose-type-url');
var Schema = mongoose.Schema;
const validator= require('validator');
Actor = mongoose.model('Actor');

var SponsorSchema = new Schema({

    banner: {
        data: Buffer,
        contenntType: String
    },
    link: {
        type: String,
        requied: 'Kindly enter the landing page',
        validate: { 
            validator: value => validator.isURL(value, { 
                protocols: ['http','https','ftp'], 
                require_tld: true, 
                require_protocol: true 
            }),
            message: 'Must be a Valid URL' 
          }
    },
    payed: {
        type: Boolean,
        default: false
    },
    sponsor: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        index:true
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }
},
{strict:false}); 

SponsorSchema.pre('save', async function (callback) {
    
    const sponsor = await Actor.findById({_id: this.sponsor}); 
    if (sponsor.flat_rate) {
        console.log("Flat rate = true cuando el Sponsor ha pagado");
        this.payed = true;
    }else{
        console.log("Flat rate = false si el Sponsor no ha pagado");
    }
    console.log(this.payed);
    callback();
});

module.exports = mongoose.model('Sponsor', SponsorSchema);
