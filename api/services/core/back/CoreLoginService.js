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

    // check the username , the token , the .session.isLogged, .session.token, .session.user

    module.exports = {


        login: function (req, res, username, password, token ) {


            var output = false;

            console.log('coreloginservice - username', username);
            console.log('coreloginservice - password', password);


            if ( username == 'admin@admin.com' && password == 'admin'){

            req.session.token = 'token';

                output = true;

            }
            return output;
        },

        isLogged: function(req, res) {

            var output = false ;

            console.log('CoreLoginService - req', req);

            if ( req && req.session && req.session.token){

                output = true;

            }


            return output;
        },

        logout: function (req, res) {

            delete req.session.token;

        }

    }