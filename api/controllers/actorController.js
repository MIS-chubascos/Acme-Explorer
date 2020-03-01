'use strict';

var mongoose = require('mongoose'),
    Actor = mongoose.model('Actors'),
    TripApplication = mongoose.model('TripApplications');;

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

//This method updates the profile. For banning an actor, use ban/unban
//Email can't be updated considering that is the account's loggin method (?)
exports.updateAnActor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        } else {
            Actor.findOneAndUpdate({ _id: req.params.actorId }, 
                {name: req.body.name, 
                    surname: req.body.surname, 
                    phoneNumber: req.body.phoneNumber, 
                    address: req.body.address, 
                    password: req.body.password},
                {new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                    runValidators: true,
                    context: 'query'
            }, function (err, actor) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.json(actor);
                }
            });
        }
    });
};

// Ban/unban methods. Only for admin users

exports.banActor = function(req,res){
    //If not and admin, res.status(403); "More privileges required due to this action"
    Actor.findOneAndUpdate({ _id: req.params.actorId},
        { $set: {"banned": "true"}},
            {new: true},
            function (err,actor){
                if (err){
                    res.status(500).send(err);
                }else{
                    res.json.send(actor);
                }
            })
}

exports.unbanActor = function(req,res){
    //If not and admin, res.status(403); "More privileges required due to this action"
    Actor.findOneAndUpdate({ _id: req.params.actorId},
        { $set: {"banned": "false"}},
            {new: true},
            function (err,actor){
                if (err){
                    res.status(500).send(err);
                }else{
                    res.json.send(actor);
                }
            })
}

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





exports.getTripApplicationsByActor = function(req, res) {
    //Check if the user is an explorer and if not: res.status(403); "only explorers can list their applications"
    var query = {};

    if (req.query.explorer == "true") {
        query.explorer = req.params.actorId;

    } else {
        query.manager = req.params.actorId;
    }

    TripApplication.find(query).sort({status: 'asc'}).exec(function(err, tripApplications) {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(tripApplications);
        }
    });
};

/** Cube */
exports.cubeFunction = function({explorer, period},res){

}

/** Log methods. We will use firebase (has not yet been taught in class) */

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
