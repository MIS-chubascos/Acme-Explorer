# Acme-Explorer
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)  

## Start the server

To start the server, just run `npm start`

## Populate the database with dummies [ A+ ]

To populate the database, do `GET /populate?size={size}`, where *size* is the number of instances to be created
for every model. For example, `/populate?size=1` would create one manager, one trip, one tripApplication and so on.

This feature has been implemented thanks to *mongoose-dummy* library.

## Generate complexity reports for the controllers [ A+ ]

To generate the reports, open the terminal and execute the following commands:
* `npm install -g plato`
* `plato -r -d complexityReports api/controllers`

This will generate an *html* report that you can find in the folder *complexityReports*.

This feature has been implemented thanks to *plato* library.


## Hash the user's password [ A+ ]

The package needed is installed by the following command:
* `npm install bcrypt`

In short terms, this package makes you able to hash the user's password generating your own salt and hash. 

In cryptography, a salt is random data that is used as an additional input to a one-way function that hashes data.

Checkout actorModel at line 48 and below.

## Advanced use of promises [ A+ ]

To develop the cube requirement, we have made use of  *promises*. This is a hightlight
of the entire implementation, that can be found in the file `api/controllers/dataWareHouseController.js`:

```javascript
Promise.all(tripAppsByPeriod).then((obtainedTripAppsByPeriod) => { 
        var tripsByTripApps = []
        obtainedTripAppsByPeriod.map((tripApplications, index) => { 
            tripApplications.map((tripApplication) => { 
                tripsByTripApps.push(Trip.aggregate([
                    {$match: {_id: {$in: tripApplication.trips}}},
                    {$group: {_id: tripApplication._id, money: {$sum: "$price"}}},
                    {$project: {_id: tripApplication._id, money: "$money", period: tripApplication.period}}
                ]).exec())
            });
            Promise.all(tripsByTripApps).then((result) => {
                result.map((res) => {
                    ...
                })
            });
        });
    });
```