'use strict';

var mongoose = require('mongoose'),
    Sponsorship = mongoose.model('Sponsorships');

var authController = require('./authController');
var actorController = require('./actorController');


exports.createSponsorship = async function(req,res){
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
}

exports.getSponsorshipV1 = function(req,res){
    Sponsorship.findById(req.params.sponsorshipId, function(err, sponsorship){
        if(err){
            res.status(500).send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
        } else if (!sponsorship) {
            res.status(404).send("Sponsorship with id " + String(req.params.sponsorshipId) + " not found");
        }else{
            res.json(sponsorship);
        }
    });
}

exports.getSponsorshipV2 = async function(req,res){
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.sponsor) {
        Sponsorship.findById(req.params.sponsorshipId, function(err, sponsorship){
            if(err || sponsorship == null){
                res.status(500).send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
            }else{
                res.json(sponsorship);
            }
        });
    } else {
        res.status(403);
        res.json({message: 'Forbidden. More privileges are required.',error: err});
    }
}

exports.deleteSponsorshipV1 = async function (req, res) {
    Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
        if (err) {
            res.send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
        } else if (!sponsorship) {
            res.status(404).send("Sponsorship with id " + String(req.params.sponsorshipId) + " not found");
        } else {
            Sponsorship.findOneAndDelete({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
                if (err || sponsorship == null) {
                    res.send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
                } else {
                    res.json({ message: 'Sponsorship successfully removed.' })
                }
            })
        }
    });
}

exports.deleteSponsorshipV2 = async function (req, res) {
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.sponsor) {
        Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
            if (err || sponsorship == null) {
                res.send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
            } else {
                Sponsorship.findOneAndDelete({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
                    if (err || sponsorship == null) {
                        res.send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
                    } else {
                        res.json({ message: 'Sponsorship successfully removed.' })
                    }
                })
            }
        });
    } else {
        res.status(403);
        res.json({message: 'Forbidden. More privileges are required.',error: err});
    }
}

exports.updateSponsorshipV1 = async function(req,res){
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new:true}, function(err,sponsorship){
        if(err){
            res.status(500).send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
        } else if (!sponsorship) {
            res.status(404).send("Sponsorship with id " + String(req.params.sponsorshipId) + " not found");
        }else{
            res.json(sponsorship);
        }
    });
}

exports.updateSponsorshipV2 = async function(req,res){
    var idToken = req.headers['idToken'];
    var authenticatedActorId = await authController.getUserId(idToken);

    if (authenticatedActorId == req.body.sponsor) {
        Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new:true}, function(err,sponsorship){
            if(err || sponsorship == null){
                res.status(500).send("Error finding sponsorship with id " + String(req.params.sponsorshipId));
            }else{
                res.json(sponsorship);
            }
        });
    } else {
        res.status(403);
        res.json({message: 'Forbidden. More privileges are required.',error: err});
    }
}

exports.getTripRandomSponsorship = function(req,res){
    var tripId = req.params.tripId;
    Sponsorship.find({ "trip": tripId, "payed": true }, function(err, sponsorships){
        if(err){
            res.status(500).send(err);
        } else if (!sponsorships || sponsorships.length == 0) {
            res.status(404).send("Sponsorships for trip with id " + String(tripId) + " not found");
        }else{
            var sponsorship = sponsorships[Math.floor(Math.random() * sponsorships.length)]
            res.json({ "banner": sponsorship.banner, "url": sponsorship.url });
        }
    })
}

