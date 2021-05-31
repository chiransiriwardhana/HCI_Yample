var CoreCommunDbService = require('../../../services/core/back/CoreCommunDbService');

var bcrypt = require('bcryptjs');

var ObjectId = require('mongodb').ObjectID;

var urlConnection = CoreCommunDbService.getUrlConnexion();

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
        setInstallationDone: function () {         // set to done the installation step inserting data in installation collection

            console.log('[start]: CoreInsertDbService - setInstallation done')

            var MongoClient = require('mongodb').MongoClient;
            console.log('start - createUserAdminDefault  - urlConnexion ', urlConnection);

            MongoClient.connect(urlConnection).then(function (db) {//Connect to the db

                var date = new Date();
                var createdAt = date.toISOString();
                var data = {
                    status: 'done',
                    createAt: createdAt
                }
                console.log('InsertDbService - setInstallationDone - data', data);
                var collection = db.collection('installation');

                if ( sails.config.demoMode != 1 ) {

                    collection.insert(data, function (err, result) {

                        console.log('insert err', err);
                        console.log('insert result', result);
                    });
                }
            })
            console.log('[end]: CoreInsertDbService - setInstallation done')
        },



        initTableStatus: function(){

            console.log('[start]: initTableStatut done');

            var MongoClient = require('mongodb').MongoClient;
            console.log('start - createUserAdminDefault  - urlConnexion ', urlConnection);

            MongoClient.connect(urlConnection).then(function (db) {//Connect to the db

                var date = new Date();
                var createdAt = date.toISOString();
                var data = [{
                    status: 'created',
                    id: 1,
                    createdAt: createdAt
                },{status: 'payed',
                    id: 2,
                    createdAt: createdAt
                }];
                console.log('InsertDbService - setInstallationDone - data', data);
                var collection = db.collection('status');

                    collection.insert(data, function (err, result) {

                        console.log('insert err', err);
                        console.log('insert result', result);
                    });

            })
            console.log('[end]:  initTableStatut done')

        }



    }
