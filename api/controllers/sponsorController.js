'use strict';

var mongoose = require('mongoose'),
    SponsorShip = mongoose.model('Sponsor');

exports.search_a_sponsor = function (req, res) {

    var actor_id = req.query.actorId;


    var aggregate_body = [];
    if (typeof actor_id !== "undefined") {
        aggregate_body = [{ $match: { sponsor: mongoose.Types.ObjectId(actor_id) } }];
    }

    SponsorShip.aggregate(aggregate_body, function (err, sponsor) {
        if (err) {
            res.send(err);
        } else {
            res.send(sponsor);
        }
    });

};

exports.update_a_sponsor = function (req, res) {
    Sponsor.findById(req.params.sponsorId, function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            Sponsor.findOneAndUpdate({ _id: req.params.sponsorId }, req.body, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                context: 'query'
            }, 
            function (err, actor) {
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

exports.delete_a_sponsor = function (req, res) {
    Sponsor.remove({ _id: req.params.sponsorId }, function (err, sponsor) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ 
                message: 'Sponsor eliminado correctamente' 
            });
        }
    });
};
exports.create_a_sponsor = function (req, res) {
    //Compruena si el usuario es un sponsor y, si no, devuelve 'res.status(403): 
    //Acceso válido pero requiere más privilegios'

    var new_sponsor = new Sponsor(req.body);
    new_sponsor.save(function (err, sponsor) {
        if (err) {
            res.send("403 ERROR - "+ err);
        }
        else {
            res.json(sponsor);
        }
    });
};
