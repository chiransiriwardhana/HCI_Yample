//var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');

var host = sails.config.connections.mongodbServer.host;
var port = sails.config.connections.mongodbServer.port;
var database = sails.config.connections.mongodbServer.database;
var urlConnection = "mongodb://" + host + ":" + port + '/' + database;

var ObjectId = require('mongodb').ObjectID;

getValueFromArray = function (data, element, type) {

    //return 10;

    var output = '';
    // console.log('enter function getValueArray');
    // console.log('data.element',data.[element] );
    if (data && data[element]) {

        if (type == 'int') {
            //  output = parseInt(data[element])
        }
        else {
            output = data[element];
        }
    }
    return output;

},

    module.exports = {

        deleteProduct: function (productId) { // Insert a product in table product

            var MongoClient = require('mongodb').MongoClient;
            console.log('CoreDeleteDbService - url connexion ', urlConnection);
            console.log('coredeleteservice - idProduct', productId);

            MongoClient.connect(urlConnection).then(function (db) {

                if (sails.config.demoMode != 1) {

                    var collection = db.collection('product');
                    //collection.deleteOne({_id: ObjectId(productId)}, function (err, result) {
                        collection.deleteOne({idProduct: parseInt(productId)}, function (err, result) {

                        console.log(err);
                        console.log('delete product result', result);
                    });
                }
            });
        },


        deleteCategory: function (categoryId) { // Insert a product in table product

            var MongoClient = require('mongodb').MongoClient;
            console.log('CoreDeleteDbService - url connexion ', urlConnection);
            console.log('coredeleteservice - category id', categoryId);

            MongoClient.connect(urlConnection).then(function (db) {

                if (sails.config.demoMode != 1) {

                    var collection = db.collection('category');
                    collection.deleteOne({_id: ObjectId(categoryId)}, function (err, result) {

                        console.log(err);
                        console.log('result', result);
                    });
                }
            });
        },



        getConnexion: function () {
            var MongoClient = require('mongodb').MongoClient;
            console.log('InsertDbService - url connexion ', urlConnection);
            return MongoClient;
        }

    }