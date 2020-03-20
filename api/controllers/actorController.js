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

//This method updates the profile. For banning an actor, use ban/unban
//Email can't be updated considering that is the account's loggin method (?)
exports.updateAnActor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err || !actor) {
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



/** Cube methods */  

/**Launch a process to compute a cube of the form M[e, p] that returns the amount of
money that explorer e has spent on trips during period p, which can be M01-M36 to
denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years. */

/**We will receive two parameters from a form: 
 * An explorer
 * An ammount of time for making a period [Today -> 1 to 36 months]. It can be given in years (1 to 3)
*/

/**According to the requirements, it can be introduced as M01-M36 or as Y01-Y03. 
 * We need to parse the string and upercase it for evading minor typing errors
 */
function getPeriod(string) {
    try { 
        var initDate = new Date(); //The first day of the period (setted below)
        var uppercased  = string.toUpperCase(); //Upercased input
        var numbers = Number(uppercased.substring(1,3)); //Syntax for the form M01-M36
        
        // Now we have two posibilities: Mxx or Yxx
        // First months (M)
        if (string.startsWith("M")) {
            if (numbers < 1 || numbers > 36) { // Months can be from 1 to 36
                return {error: "Please insert a month between 1 and 36 both included"};

            } else {
                initDate.setMonth(initDate.getMonth - numbers);
            }
        
        // now years (Y)
        } else if (string.startsWith("Y")) {
            if (numbers < 1 || numbers > 3) {
                return {error: "Please insert a year between 1 and 3 both included"};

            } else {
                initDate.setFullYear(initDate.getFullYear() - numbers);
            }

        } else { //bad syntax
            return {error:"Period must be as following: M01-M36 of Y01-Y03"};
        }

        return {initDate: initDate};

    } catch(error) { //Probably bad syntax
        return {error:"Period must be as following: M01-M36 of Y01-Y03"};
    }
}

// Once we have processed the date we can perform the calculations
exports.cubeDataMoney = function(req,res) {
    var explorer = req.params.explorer; // We receive an explorer from a form
    var periodPreProcesed = req.params.period; // We receive the period input
    var period = getPeriod(periodPreProcesed); //Process the period for obtaining two dates

    if (period.error) {
        res.status(400).send(period.error);

    } else {
        var initialDay = period.initDate; //Date for making the period
    
        TripApplication.aggregate([
            {
                $match: { // filtering the trips of the explorer by his applications
                    status: "ACCEPTED",
                    explorer: explorer,
                    paidDate: {
                        $gte: initialDay
                    }
                }
            },
            {
                $group: {  //we need the trips of the explorer for calculating the total ammount of money
                    _id: "$explorer",
                    trips: {$push: "$trip"}
                }
            }
        ], function(err, tripApplications) {
            if (err) {
                res.send(err);
            } else {
                Trip.aggregate([
                    {
                        $match: {
                            _id: {$in: tripApplications}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            money: {$sum: "$price"}
                        }
                    }
                ], function(err, results) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(results); //if all is ok, return the data 
                    }
                });
            }
        });
    }
}

/**Given p, return the explorers e such that M[e, p] q v, where v denotes an arbitrary
amount of money and q is a comparison operator (that is, “equal”,
“not equal”, “greater than”, “greater than or equal”, “smaller than”, or “smaller than or equal”). */

// Translate the comparator. We're gonna receive a comparator. Mongo syntax is different (== -> $eq) 

function translateMongoComparator(string){
    var res;
    switch(string){
        case"==":
        res = "$eq";
        break;
        
        case"!=":
        res = "$ne";
        break;
        
        case">":
        res = "$gt";
        break;
        
        case">=":
        res = "$gte";
        break;
        
        case"<":
        res = "$lt";
        break;
        
        case"<=":
        res = "$lte";
        break;
        
        default:
        res=null;
        break;
    }
    return res;
}

//We will receive something like    get all M[p,e] > V    
exports.cubeDataComparator = function(req, res) {
    var period = req.params.period; //period in query
    var queryComparator = req.params.comparator; //first extract the comparator requested in string
    var comparators = ['==','!=','>','>=','<','<=']; //preventing input errors
    var ammount = req.params.ammount; //the ammount of money 'V' asked in query

    if (comparators.includes(queryComparator)) { //preventing input errors
        var queryAmmount = {};
        var comp = translateMongoComparator(queryComparator); //we need to fill a mongo query so we need to translate
        queryAmmount[comp] = ammount; //This will build the money query we need in the form {comparator:ammount} {$gt:5}
        TripApplication.aggregate([  //It is easier to rebuild the query than making a dynamic method
            {
                $match:{
                    period: period,
                    ammount: queryAmmount
                }                         
            }, {$group: //groups input docs by specified id expression
                    {_id:"$explorer", explorers: {$push:"$explorer"} } },
               {$project: //passes the doc with req fields to next stage in pipeline
                    {_id:false, explorers: "$explorers"} }
        ], function(err, explRes){
            if(err){
                res.send(err);
            }else{
                res.send(explRes)
            }
        });
    }else{
        res.send("Check the compaprator. Only ['==','!=','>','>=','<','<='] are supported.")
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
