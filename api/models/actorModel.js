'use strict';

//Importamos mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var ActorSchema = new Schema({
    name: {
        type: String,
        required: 'Please, enter a name'
    },
    surname: {
        type: String, 
        required: 'Please, enter a surname'
    },
    email: {
        type: String,
        unique: true,
        required: 'Please, enter an email',
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '{VALUE} is not a valid email']
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: 'Enter a valid password please'
    }, 
    banned: {
        type: Boolean,
        default: false
    },
    actorType: [{
        type: String,
        required: 'Select the type of actor please',
        enum: ['ADMINISTRATOR','MANAGER','EXPLORER','SPONSOR']
    }],
    },

    { strict: false }); //False por defecto. Posibilita pasar al modelo constructores diferentes al esquema 
var hashed = function (password) {
  return new Promise(function (resolve, reject) {
    if (password) {
      var salt = bcrypt.genSaltSync(5);
      var hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } else {
      var error = new Error('no password');
      reject(error);
    }

  });
};

ActorSchema.pre('save', async function (callback) {
    var actor = this;
    hashed(actor.password).then(function (myhash) {
      actor.password = myhash;
      callback();
    })
  });
  ActorSchema.pre("findOneAndUpdate", async function (callback) {
    var actor = this;
    var password = this.getUpdate().password;
    hashed(password).then(function (myhash) {
      actor.update({ password: myhash })
      callback();
    })
  });
  
  ActorSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      console.log('verifying password in actorModel: ' + password);
      if (err) return cb(err);
      console.log('iMatch: ' + isMatch);
      cb(null, isMatch);
    });
  };

  
module.exports = mongoose.model('Actors', ActorSchema);
