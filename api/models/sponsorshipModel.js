'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({

    sponsor: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: 'Please, a sponsor is needed'
      },
    url: {
        type: String,
        required: 'Please, enter the landing page',
        validate: [validateURL,"Please, enter a valid URL"]
      },
    banner: {
        data: Buffer, 
        contentType: String
        //required: 'Please, add an image banner'
      },
    trips: [{
        type: Schema.Types.ObjectId,
        ref: 'Trip'
      }],
    flatRate:{
        type: Number,
        required:'Please, insert a quantity'
    },
    payed: {
        type: Boolean,
        default: false
      }
    },   
    { 
        strict: false
    });  

    SponsorshipSchema.index({sponsor: 1});
    SponsorshipSchema.index({banner: 1 });

    function validateURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        
        if(!pattern .test(str)) {
          return false;
        } else {
          return true;
        }
      }

    module.exports = mongoose.model('Sponsorships', SponsorshipSchema);
