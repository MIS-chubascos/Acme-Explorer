'use strict';

var mongoose = require('mongoose'),
    Actor = mongoose.model('Actor');
var admin = require('firebase-admin');
var authController = require('./authController');

exports.listAllActors = function (req, res) {
    Actor.find({}, function (err, actors) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(actors);
        }
    });
};

exports.loginAnActor = async function (req, res) {
    console.log('starting login');
    var emailParam = req.query.email;
    var password = req.query.password;
    Actor.findOne({ email: emailParam }, function (err, actor) {
        if (err) { res.send(err); }

        // Wrong email provided
        else if (!actor) {
            res.status(401); //access token not provided or invalid
            res.json({ message: 'forbidden', error: err });
        }

        else if (actor.banned == true) {
            res.status(403); //access token valid. User is banned
            res.json({ message: 'forbidden', error: err });
        }
        else {
            // Check the pWord
            //console.log('actorController pWord: '+password);
            actor.verifyPassword(password, async function (err, isMatch) {
                if (err) {
                    res.send(err);
                }

                // Password mismatch
                else if (!isMatch) {
                    res.status(401); //access token not provided or invalid
                    res.json({ message: 'forbidden', error: err });
                }

                else {
                    try {
                        var customToken = await admin.auth().createCustomToken(actor.email);
                    } catch (error) {
                        console.log("Error creating custom token:", error);
                    }
                    actor.customToken = customToken;
                    console.log('Login Success... sending JSON with custom token');
                    res.json(actor);
                }
            });
        }
    });
};

//Should be an admin
exports.createAnActor = function (req, res) {
    var new_actor = new Actor(req.body);
    new_actor.save(function (error, actor) {
        if (error) {
            res.send(error);
        }
        else {
            res.json(actor);
        }
    });
};
//Should be an admin
exports.readAnActor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(actor);
        }
    });
};

//Should be an admin (?) himself
exports.updateAnActor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.send(err);
        } else {
            var new_actor = req.body;
            Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                context: 'query'
            }, function (err, actor) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(actor);
                }
            });
        }
    });
};

exports.validateAnActor = function (req, res) {
    //Check Admin. If not -> res.status(403); "valid access token. Required higher privileges"
    console.log("Validating an actor with id: " + req.params.actorId)
    Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "validated": "true" } }, { new: true }, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(actor);
        }
    });
};

//Should be an admin (?) himself (?) owe bills
exports.deleteAnActor = function (req, res) {
    Actor.remove({
        _id: req.params.actorId
    }, function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'actor successfully deleted' });
        }
    });
};
