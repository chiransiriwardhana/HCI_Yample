//var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');

// create reusable transporter object using SMTP transport
//var transporter = nodemailer.createTransport({
 //   service: 'Gmail',
 //   auth: sails.config.project.nodemailer.auth
//});

console.log('sails.config.connections');
var host = sails.config.connections.mongodbServer.host;
var port = sails.config.connections.mongodbServer.port;
var database = sails.config.connections.mongodbServer.database;
var urlConnection = "mongodb://" + host + ":" + port + '/' + database;


    module.exports = {


        startCreateUserFront: function (req) { // Start creation flow user front

            console.log (' UserController - req - test1 ', req.body );

            var MongoClient = require('mongodb').MongoClient;
            console.log('start - createUserAdminDefault  - urlConnexion ', urlConnection);

            //Connect to the db
            MongoClient.connect(urlConnection).then(function (db) {

                var password = req.body.password;
                var name = req.body.name;
                var email = req.body.email;
                var subscriptionConfirmed = 0 ;
                var token = 0 ;

                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) {
                                console.log(err);
                            } else {
                                //console.log('hash', hash);

                                var collection = 'user';
                                var date = new Date();
                                var createdAt = date.toISOString();
                                var updatedAt = '';

                                var dataToInsert = {
                                    name: name,
                                    email: email,
                                    password: hash,
                                    permission: 'Customer',
                                    createdAt: createdAt,
                                    updatedAt: updatedAt,
                                    subcriptionConfirmed: subscriptionConfirmed,
                                    token: token
                                }

                                var collection = db.collection(collection);
                                collection.insert(dataToInsert);
                            }
                        });
                    }
                });
            });
        }



    }