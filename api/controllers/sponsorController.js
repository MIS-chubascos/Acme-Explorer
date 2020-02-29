'use strict';

var mongoose = require('mongoose'),
    Patrocinio = mongoose.model('Sponsorships');


exports.create_a_sponsorship=function(req,res){
    var new_sponsorship = new Patrocinio(req.body);
    new_sponsorship.save(function(err,sponsorship){
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
    Patrocinio.findById(req.params.sponsorshipId, function(req,res){
        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    });
}

exports.delete_a_sponsorship=function(req,res){
    Patrocinio.deleteOne(req.params.sponsorshipId, function(req,sponsorship){
        if(err){
            res.status(500).send(err);
        }else{
            res.json({message:'Sponsorship Deleted!'});
        }
    });
}

exports.update_a_sponsorship=function(req,res){
    Patrocinio.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new:true}, function(err,sponsorship){
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
    Patrocinio.find(function(err,Sponsor){

        if(err){
            res.status(500).send(err);
        }else{
            res.json(sponsorship);
        }
    });
}

