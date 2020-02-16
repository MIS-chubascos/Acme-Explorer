'use strict';

//importancion moongose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var bcrypt = require('bcrypt');
var crypto = require('crypto');


  { strict: false }); //puede recibir cosas que no estan en el modelo
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
