/* Copyright 2016 PayPal */
"use strict";
var paypal = require('paypal-rest-sdk');
var CoreReadDbService = require('../back/CoreReadDbService');


module.exports = {


    paymentActionWithPaypal: function (req, res, mode, client_id, client_secret, itemList, amount) {

        // using the req.session we set the item and amount for paypal json data
        // we get the mode, client_id, and client_secret from collection

        var idPayment = req.params.idPayment;
        var baseUrl = req.baseUrl;

        console.log('req.path', req.path);

        var urlPath = req.path; // containing the id payment
        var redirectUrlSuccess = baseUrl + '/payment/paypal/execute/success/' + idPayment;
        var redirectUrlCancel = baseUrl + '/payment/paypal/execute/cancel/' + idPayment;

        paypal.configure({
            'mode': mode, //sandbox or live
            'client_id': client_id,
            'client_secret': client_secret
        });

        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": redirectUrlSuccess,
                "cancel_url": redirectUrlCancel
            },
            "transactions": [{
                "item_list": itemList,
                "amount": amount,
                "description": "This is the payment description with Ymple."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log('payment', payment.links[1].href);
                console.log(JSON.stringify(payment, null, 2));

                var redirectUrl = payment.links[1].href;
                res.redirect(redirectUrl); // redirect to paypal approval_url

            }
        });
    },


    paymentActionWithCreditCard: function (req, res, mode, client_id, client_secret) {

        paypal.configure({
            'mode': mode, //sandbox or live
            'client_id': client_id,
            'client_secret': client_secret
        });

        console.log('[start]: paymentActionWithCreditCard');

        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card": {
                        "type": "visa",
                        "number": "",
                        "expire_month": "",
                        "expire_year": "",
                        "cvv2": "",
                        "first_name": "",
                        "last_name": "",
                        "billing_address": {
                            "line1": "",
                            "city": "",
                            "state": "PI",
                            "postal_code": "56028",
                            "country_code": "IT"
                        }
                    }
                }]
            },
            "transactions": [{
                "amount": {
                    "total": "0.10",
                    "currency": "EUR",
                    "details": {
                        "subtotal": "0.10",
                        "tax": "0",
                        "shipping": "0"
                    }
                },
                "description": "This is the payment transaction description."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
            }
            return 'transaction done';
        });
    },


    paymentPaypalExecute: function (req, res, mode, client_id, client_secret) {

        var idPayment = req.params.idPayment;
        var baseUrl = req.baseUrl;

        var redirectUrlConfirmationSuccess = baseUrl + '/payment/paypal/execute/confirmation/success/' + idPayment;
        var redirectUrlConfirmationError = baseUrl + '/payment/paypal/execute/confirmation/error/' + idPayment;

        // we retrieve from the redirect the value payerId and paymentId
        console.log('ModulePaymentPaypalService - paymentPaypalExecute - req.query', req.query);

        paypal.configure({
            'mode': mode,//'live', //sandbox or live
            'client_id': client_id,
            'client_secret': client_secret
        });

        var idOrder = req.params.idPayment;

        CoreReadDbService.getTotalAmountForOneOrder(idOrder).then(function (total) {

            console.log( 'from query to get total amount - total',total );

            var payerId = req.query.PayerID;
            var paymentId = req.query.paymentId;

            /*var execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "EUR",
                        "total": total
                    }
                }]
            };*/


            var execute_payment_json = {
                "payer_id": payerId
            };

            console.log ("payerid ", payerId);
            console.log("paymentId", paymentId);

            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);

                    res.redirect(redirectUrlConfirmationError); // confirmation of the execute

                    throw error;
                } else {

                    console.log("Get Payment Response");
                    console.log(JSON.stringify(payment));

                    res.redirect(redirectUrlConfirmationSuccess); // confirmation of the execute
                }
            });


        });

    }
}