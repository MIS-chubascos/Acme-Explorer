'use strict';

var mongoose = require('mongoose'),
    Sponsorship = mongoose.model('Sponsorships');


exports.createSponsorship = function(req,res){
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

exports.updateSponsorship = function(req,res){
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new:true}, function(err,sponsorship){
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


exports.getAllSponsorships = function(req,res){
    Sponsorship.find(function(err,Sponsor){
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

