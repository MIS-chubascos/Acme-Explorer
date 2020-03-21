'use strict'

var mongoose = require('mongoose'),
Config = mongoose.model('Config');

exports.getConfig = function (req, res) {
    Config.findOne({}, function(err, config){
        if (err) {
            res.send(err);
        }else{
            res.json(config);
        }
    });
};

exports.updateConfig = function(req, res) {
    Config.findById(req.params.configId, function (err, config) {
        if(err){
            res.send(err);
        
        } else if (!config) {
            res.status(404).send({message: "No configuration found for the given ID"});

        }else{
            Config.findOneAndUpdate({ _id: req.params.configId}, req.body, {new: true}, function(err,config){
                if(err){
                    res.send(err);
                }else{
                    res.json(config);
                }
            });
        }
    });
};
