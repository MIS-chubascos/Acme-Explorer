'use strict';

var mongoose = require('mongoose'),
    Sponsorship = mongoose.model('Sponsorships');

var authController = require('./authController');
var actorController = require('./actorController');


exports.createSponsorship = async function(req,res){
    var idToken = req.headers['idToken'];

    if (!idToken) {
        res.status(401);
        res.json({message: 'Forbidden. Token must be provided.',error: err});
    } else {
        var authenticatedActorId = await authController.getUserId(idToken);
        var authenticatedActor = await actorController.readAnActor(authenticatedActorId);

        if (authenticatedActor.actorType.include('SPONSOR') && authenticatedActor.banned == false) {
            var newSponsorship = new Sponsorship(req.body);
            newSponsorship.save(function(err,sponsorship){
                if(err){
                    if(err.name=='ValidationError'){
                        res.status(422).send(err);
                    }else{
                        res.status(500).send(err);
                    }
                }else{
                    res.json(sponsorship);
                }
            });

        } else {
            res.status(403);
            res.json({message: 'Forbidden. More privileges are required. ',error: err});
        }
    }
}

exports.getSponsorship = function(req,res){
    Sponsorship.findById(req.params.sponsorshipId, function(req,res){
        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    });
}

exports.deleteSponsorship = function(req,res){
    Sponsorship.findOneAndDelete({ _id: req.params.sponsorshipId }, function(req, sponsorship){
        if(err){
            res.status(500).send(err);
        }else{
            res.json({message:'Sponsorship Deleted!'});
        }
    });
}

exports.updateSponsorship = async function(req,res){
    var idToken = req.headers['idtoken'];

    if (!idToken) {
        res.status(401);
        res.json({message: 'Forbidden. Token must be provided.',error: err});
    } else {
        var authenticatedActorId = await authController.getUserId(idToken);
        var authenticatedActor = await actorController.readAnActor(authenticatedActorId);

        if (authenticatedActor.actorType.include('SPONSOR') && authenticatedActorId == req.body.manager 
            && authenticatedActor.banned == false) {
            
                Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new:true}, function(err,sponsorship){
                    if(err){
                        if(err.name=='ValidationError'){
                            res.status(422).send(err);
                        }else{
                            var updatedSponsorship = req.body;

                            sponsorship.sponsor = updatedSponsorship.sponsor;
                            sponsorship.url = updatedSponsorship.url;
                            sponsorship.banner = updatedSponsorship.banner;
                            sponsorship.trip = updatedSponsorship.trip;
                            sponsorship.payed = updatedSponsorship.payed;

                            sponsorship.save(function(error, newSponsorship){
                                if(error){
                                    res.send(error);
                                }else{
                                    res.json(newSponsorship);
                                }
                            });

                        }   
                    }else{
                        res.json(sponsorship);
                    }
                });
            
        } else {
            res.status(403);
            res.json({message: 'Forbidden. More privileges are required.',error: err});
        
        }

    }
}


exports.getAllSponsorships = function(req,res){
    Sponsorship.find(function(err, sponsorship){
        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    });
}

exports.getTripSponsorships = function(req,res){
    var tripId = req.params.tripId;
    Sponsorship.find({trip: tripId}, function(err, sponsorships){
        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorships);
        }
    });
}

exports.getTripRandomSponsorship = function(req,res){
    var tripId = req.params.tripId;
    Sponsorship.aggregate([{ $match: { trip: tripId }}, { $sample: { size: 1 }}]), function(err, sponsorship){
        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    }
}

