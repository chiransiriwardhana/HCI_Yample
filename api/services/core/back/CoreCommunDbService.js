var bcrypt = require('bcryptjs');

var ObjectId = require('mongodb').ObjectID;

console.log('sails.config.connections');
var host = sails.config.connections.mongodbServer.host;
var port = sails.config.connections.mongodbServer.port;
var database = sails.config.connections.mongodbServer.database;

var urlConnection = "mongodb://" + host + ":" + port + '/' + database;

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


        getUrlConnexion: function(){

            return urlConnection;

        }



    }