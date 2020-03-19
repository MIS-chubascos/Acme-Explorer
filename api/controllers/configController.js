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
        if(err || !config){
            res.send(err);
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
