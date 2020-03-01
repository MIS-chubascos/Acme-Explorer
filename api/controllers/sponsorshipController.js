'use strict';

var mongoose = require('mongoose'),
    Sponsorship = mongoose.model('Sponsorships');


exports.create_a_sponsorship=function(req,res){
    var newSponsorship = new Sponsorchip(req.body);
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

exports.read_a_sponsorship=function(req,res){
    Sponsorchip.findById(req.params.sponsorshipId, function(req,res){
        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    });
}

exports.delete_a_sponsorship=function(req,res){
    Sponsorchip.deleteOne(req.params.sponsorshipId, function(req,sponsorship){
        if(err){
            res.status(500).send(err);
        }else{
            res.json({message:'Sponsorship Deleted!'});
        }
    });
}

exports.update_a_sponsorship=function(req,res){
    Sponsorchip.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new:true}, function(err,sponsorship){
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


exports.list_all_sponsorships=function(req,res){
    Sponsorchip.find(function(err,Sponsor){

        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    });
}

