/**
 * SubscriptionController
 *
 * @description :: Server-side logic for managing Subscriptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pathToService = '../../../services/core/';
var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');

module.exports = {
    newsletter: function (req, res) {


        var email = req.param('email');

        console.log('email', email);

        console.log('[start]- newsletter');

        var result = {
            result: 'success',
            product: 'test'
        };

        //var email = 'f@gmail.com';

        CoreInsertDbService.installSubscriptionNewsletter(email);

        return res.json(result);


    }
};
