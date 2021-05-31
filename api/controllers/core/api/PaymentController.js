/**
 * Api/paymentController
 *
 * @description :: Server-side logic for managing api/payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var CoreReadDbService = require('../../../services/core/back/CoreReadDbService');
var CoreInsertDbService = require('../../../services/core/back/CoreInsertDbService');
var ModulePaymentPaypalService = require('../../../services/core/api/ModulePaymentPaypalService');
var pathTemplateBackCore = sails.config.globals.templatePathFrontCore;
var _ = require('underscore');


const async = require('promise-async')

module.exports = {

    paypalPay: function (req, res) {

        var idOrder = req.params.idPayment;
        console.log('[start]: payment controller');
        console.log('api - paymentController - id', req.params.idPayment);
        console.log('api - paymentController - req.session', req.session);

        // get all the information about this order

        async.waterfall([

            function (callback) {

                CoreReadDbService.getItemPaymentFromOrder(idOrder).then(function (dataOrder) {

                    console.log('paymentController - dataOrder', dataOrder);
                    var itemCart = dataOrder[0].cart;

                    callback(null, itemCart);
                });
            },

            function (arg1, callback) {

                console.log('arg1 - itemCart', arg1);

                CoreReadDbService.returnItemWithPriceForOrder(arg1).then(function (dataWithPriceOrder) {
                    console.log('paypalPay - dataWithPriceOrder', dataWithPriceOrder);

                    callback(null, arg1, dataWithPriceOrder)

                })
            },

            function (arg1, arg2, callback) {

                var dataOrder;

                console.log('arg1 at the end', arg1);
                console.log('arg2 at the end', arg2);

                var currency = "EUR";

                var itemList = getItemListFromDataOrder(arg1, arg2, currency);
                var amount = getAmountFromDataOrder(arg1, arg2, currency);

                var categoryModule = "payment";
                var nameModule = "paypal";

                CoreReadDbService.getConfigurationOneModule(categoryModule, nameModule).then(function (data) {
                    console.log('getPaypalMode - data', data);

                    if (typeof data[0] == "undefined") {

                        var url = '/?missing_configuration_paypal=1';
                        return res.redirect(url);

                    }

                    var modeDemo = data[0].mode;

                    if (modeDemo == 'live') {
                        var mode = modeDemo;
                        var client_id = data[0].client_id;
                        var client_secret = data[0].client_secret;
                    }
                    else if (modeDemo == 'sandbox') {

                        var mode = modeDemo;
                        var client_id = data[0].client_id;
                        var client_secret = data[0].client_secret;
                    }


                    ModulePaymentPaypalService.paymentActionWithPaypal(req, res, mode, client_id, client_secret, itemList, amount);

                    callback(null, 'done')

                })
            }

        ]).then(function (value) {
            console.log(value === 'done') // => true

            console.log('end of call list ');

        })

        console.log('[end]: payment controller');
    },

    paypalExecuteSuccess: function (req, res) {




        // these values must come from the database

        var categoryModule = "payment";
        var nameModule = "paypal";

        CoreReadDbService.getConfigurationOneModule(categoryModule, nameModule).then(function (data) {


            if (typeof data[0] == "undefined") {

                var url = '/?missing_configuration_paypal=1';
                return res.redirect(url);

            }

            var modeDemo = data[0].mode;

            if (modeDemo == 'live' || modeDemo == 'sandbox') {
                var mode = modeDemo;
                var client_id = data[0].client_id;
                var client_secret = data[0].client_secret;
            }

            ModulePaymentPaypalService.paymentPaypalExecute(req, res, mode, client_id, client_secret);


        })

    },

    paypalExecuteCancel: function (req, res) {

        return res.ok('Payment Paypal Cancelled');
    },

    paypalExecuteConfirmationSuccess: function (req, res) {


        var result = {};

        result.templateToInclude = 'yes';
        result.pathToInclude = '../payment/paypal/success.ejs';

        return res.view(pathTemplateBackCore + 'payment/paypal/success.ejs', result);

        //return res.ok('Payment Paypal Confirmation done');

    },

    paypalExecuteConfirmationError: function (req, res) {

        return res.ok('Payment Paypal Confirmation error');
    },


}



function getItemListFromDataOrder(input1, input2, currency) {


    var output = {};
    output.items = [];

    _.each(input2, function (val, key) {
        var item = {
            "name": val.name,
            "sku": val.name,
            "price": val.price,
            "currency": currency,
            "quantity": input1[key].quantity
        }

        output.items.push(item);

    })

    /*var output = {
     "items": [

     {
     "name": input[0].name,
     "sku": "item12222",
     "price": input[0].price,
     "currency": currency,
     "quantity": 1
     }

     /*,
     {
     "name": "item2",
     "sku": "item2",
     "price": "0.00",
     "currency": "USD",
     "quantity": 1
     }*/
    //]
    //};

    console.log('getItemListFromDataOrder - output', output);

    return output;


}

function getAmountFromDataOrder(input1, input2, currency) {

    var amount = 0;
    _.each(input2, function (val, key) {

        amount = amount + ( val.price * input1[key].quantity);

    })

    var output = {
        "currency": currency,
        "total": amount,
        "details": {
            "subtotal": amount,
            "tax": "0.00",
            "shipping": "0.00",
            "handling_fee": "0.00"
        }
    };

    return output;
}



