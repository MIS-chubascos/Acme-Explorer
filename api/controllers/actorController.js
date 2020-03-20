'use strict';

var mongoose = require('mongoose'),
    Actor = mongoose.model('Actors'),
    TripApplication = mongoose.model('TripApplications'),
    Trip = mongoose.model('Trip'),
    Sponsorship = mongoose.model('Sponsorships');
var authController = require('./authController')
var admin = require('firebase-admin');
var finderController = require('./finderController');

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


exports.createAnActor = function (req, res) {
    var newActor = new Actor(req.body);
    newActor.save(function (error, actor) {
        if (error) {
            res.send(error);
        }
        else {
            res.json(actor);
        }
    });
};

//Only adm can create manager actors
exports.createAnActorVerified = async function(req, res){
    var newActor = new Actor(req.body);

    if(newActor.actorType.includes('MANAGER')){
        var idToken = req.headers['idtoken'];
        if(idToken === null || idToken === 0){
            res.status(403).send('Only administrators can create managers. Log in');
        }
        else{
            var authUser = await authController.getUserId(idToken);
            Actor.findById(authUser, function(err, actorLoged){
                if(err){
                    res.send(err);
                }
                else{
                    if(actorLoged.actorType.includes('ADMINISTRATOR')){
                        newActor.save(function(err,saveActor){
                            if(err){
                                res.send(err);
                            }
                            else{
                                res.json(saveActor);
                            } 
                        });
                    }
                    else{
                        res.status(403).send('Only administrators can create managers')
                    }
                }
            });
        }
    }
    else if(newActor.actorType.includes(['EXPLORER'])){
        finderController.createFinder(newActor.actorId);
        newActor.save(function(err, saveActor){
            if(err){
                res.send(err);
            }
            else{
                res.json(saveActor);
            }
        })
    }
    else{
        newActor.save(function(err, saveActor){
            if(err){
                res.send(err);
            }
            else{
                res.json(saveActor);
            }
        })
    }
}

exports.readAnActor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err || !actor) {
            res.send(err);
        }
        else {
            res.json(actor);
        }
    });
};

//This method updates the profile
exports.updateAnActor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err /*|| !actor*/) {
            res.status(500).send(err);
        } else {
            Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body,
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


exports.updateAnActorVerified = function(req,res){
    //Actors can update themselves, admin can update anyone
    Actor.findById(req.params.actorId, async function(err,actor){
        if(err || !actor){
            res.send(err);
        }else{
            var idToken = req.headers['idtoken']; //custom token in req.header created by FB
            if(actor.actorType.includes('MANAGER')||actor.actorType.includes('EXPLORER')||actor.actorType.includes('SPONSOR')){
                var authUserId = await authController.getUserId(idToken);
                if(authUserId == req.params.actorId){
                    Actor.findOneAndUpdate({_id:req.params.actorId},{name: req.body.name, 
                        surname: req.body.surname, 
                        phoneNumber: req.body.phoneNumber, 
                        address: req.body.address, 
                        password: req.body.password},
                    {new: true,
                        upsert: true,
                        setDefaultsOnInsert: true,
                        runValidators: true,
                        context: 'query'
                }, function (err, actor){
                    if(err){
                        res.send(err);
                    }else{
                        res.json(actor);
                    }
                });
                }else{
                    res.status(403); //Authentication error
                    res.send('The actor is not authorised to update other than himself');
                }
            }else if(actor.actorType.includes('ADMINISTRATOR')){
                Actor.findOneAndUpdate({_id:req.params.actorId},req.body,{new:true},function(err,res){
                    if(err){
                        res.send(err);
                    }else{
                        res.json(actor);
                    }
                });
            }else{
                res.status(405); //Not allowed
                res.send('Actor has undentified roles');
            }
        }               
    });
}

/*
//Only admin can delete actors. Async function needed for authController method
exports.deleteAnActor = async function (req, res) { 
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken)
    var actorAuth = actor.findById(authenticatedUserId);
    if(actorAuth.actorType.includes('ADMINISTRATOR')){
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
}
*/

exports.deleteAnActorV1 = function(req,res){
    Actor.remove({_id: req.params.actorId}, function(err,actor){
        if(err){
            res.send(err);
        }
        else{
            res.json({ message: 'actor successfully deleted' });
        }
    })
}

// Checked admin on routes
exports.deleteAnActorV2 = async function (req, res) { 
    var actorForErase = Actor.findById(req.params.actorId);
    if(actorForErase != null){
        if(actorForErase.actorType.includes('EXPLORER')){
            finderController.deleteFinder(actorForErase.actorId)
        }
    }
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




exports.getTripApplicationsByActorV1 = function(req, res) {
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

exports.getTripApplicationsByActorV2 = async function(req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    var query = {};

    if (req.query.explorer == "true") {
        query.explorer = req.params.actorId;

    } else {
        query.manager = req.params.actorId;
    }

    if (req.params.actorId == authenticatedActorId) {
        TripApplication.find(query).sort({status: 'asc'}).exec(function(err, tripApplications) {
            if (err) {
                res.status(500).send(err);
    
            } else {
                res.send(tripApplications);
            }
        });
    }
};

exports.getManagerTripsV1 = function (req, res) {
    var query = { 'manager': req.params.actorId }
    Trip.find(query, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
}

exports.getManagerTripsV2 = async function (req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);
    var query = { 'manager': req.params.actorId }
    if (req.params.actorId == authenticatedActorId) {
    Trip.find(query, function (err, trips) {
        if (err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    })
    } else {
        res.status(403);
        res.json({message: 'Forbidden. A manager can only see all the trips created by himself.', error: err});
    }
}

exports.getSponsorSponsorshipsV1 = function (req, res) {
    var query = { 'sponsor': req.params.actorId }
    Sponsorship.find(query, function (err, sponsorships) {
        if (err) {
            res.send(err);
        } else {
            res.json(sponsorships);
        }
    })
}

exports.getSponsorSponsorshipsV2 = async function (req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);
    var query = { 'sponsor': req.params.actorId }
    if (req.params.actorId == authenticatedActorId) {
        Sponsorship.find(query, function (err, sponsorships) {
        if (err) {
            res.send(err);
        } else {
            res.json(sponsorships);
        }
    })
    } else {
        res.status(403);
        res.json({message: 'Forbidden. A sponsor can only see all the sponsorships created by himself.', error: err});
    }
}




/** Login method */

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
            console.log('actorController pWord: '+password);
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
