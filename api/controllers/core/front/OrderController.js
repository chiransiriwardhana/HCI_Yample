/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SHIPPING_FEE = 3000;


var pathToService = '../../../services/core/';
var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');

var pathTemplateFrontCore =  sails.config.globals.templatePathFrontCore;
var async = require('async');

module.exports = {
    find: function (req, res) {
        return res.view('complete.ejs', {failed: true});
    },
    check: function (req, res) {


        Order.findOne(req.body.merchant_uid, function (err, order) {


            if (err) return res.serverError(err);

            if (!order) {
                sails.log('ORDER_NOT_FOUND');
                return res.json({confirm: false, message: 'ORDER_NOT_FOUND'});
            }

            if (order.price !== amount) {
                sails.log({abuser: order.email});
                return res.json({confirm: false, reason: 'PRICE_NOT_MATCH'});
            }
            return res.json({confirm: true});
        });
    },

    paid: function (req, res) {
        sails.log('PAID:' + req.body);





        Order.findOne(req.body.merchant_uid, function (err, order) {




            if (err) return res.serverError(err);

            if (!order) {
                sails.log('ORDER_NOT_FOUND');
                return res.json({result: 'fail', message: 'ORDER_NOT_FOUND'});
            }

            order.status = 'PAID';

            if (req.body.hasOwnProperty('apply_num'))
                order.paymentLog = req.body;
            else
                order.paymentCheck = req.body;

            order.save(function (err, saved) {
                if (err) sails.log(err);

                return res.json(saved);
            });
        });
    },

    change: function (req, res) {
        var result = GetSessionData(req);

        async.waterfall([
            function GetOrder(next) {

                var orderId = req.params.id;

                CoreReadDbService.getOrderItem(orderId).then(function (order) {

                    if (req.query.hasOwnProperty('type'))
                        order.status = req.query.type;

                    return next(null, order);
                });
            },

            function SetOrder(order, next) {
                order.save(function (err, saved) {
                    if (err) return next(err);

                    result.order = saved;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);

            res.redirect('/admin/order');
        });
    },

    findOne: function (req, res) {
        var result = GetSessionData(req);

        async.waterfall([
            function GetOrder(next) {

                var orderId = req.params.id;

                CoreReadDbService.getOrderItem(orderId).then(function (order) {

                    result.order = order;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);

            if (req.query.hasOwnProperty('error')) result.error = req.query.error.toUpperCase();

            return res.view('order.ejs', result);
        });

    },

    cancel: function (req, res) {
        var result = GetSessionData(req);

        async.waterfall([
            function GetOrder(next) {
                Order.findOne(req.params.id).populate('owner').exec(function (err, order) {
                    if (err) return next(err);
                    if (!order) return next('NO_ORDER_FOUND');

                    if (order.owner.id !== req.session.user.id)
                        return next('NO_PERMISSION');

                    order.status = 'CANCEL';

                    order.save(function (err, order) {
                        if (err) return next(err);

                        result.order = order;

                        return next(null);
                    });
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);

            result.message = '주문을 취소하셨습니다.';

            return res.view('message.ejs', result);
        });
    },

    delivery: function (req, res) {
        var result = GetSessionData(req);

        async.waterfall([
            function GetOrder(next) {
                Order.findOne(req.params.id, function (err, order) {
                    if (err) return next(err);

                    if (!order.hasOwnProperty('delivery') || order.delivery === undefined)
                        return res.json({'message': '택배 번호가 없습니다.'});

                    result.order = order;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);

            result.message = '준비중입니다.';

            return res.json(result);
        });
    },

    pay: function (req, res) {


        console.log('OrderController - pay', req.session);

        var result = {
            user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
            cart: (req.session.hasOwnProperty('cart')) ? req.session.cart : undefined
        }

        if (req.session.orderReference) {

            result.orderReference = req.session.orderReference;
        } else {
            result.orderReference = 0;

        }

        async.waterfall([
            function GetOrder(next) {

                var orderId = req.params.id;

                CoreReadDbService.getOrderItem(orderId).then(function (data) {

                    if (data && data.status && data.status === 'PAID') return next('ALREADY_PAID');

                    result.order = data;
                    result.amount = 10;

                    return next(null);
                });

            },
        ], function (err) {
            if (err) return res.redirect('/order/' + req.params.id + '?error=' + err);

            return res.view(pathTemplateFrontCore + 'payment/pay.ejs', result)
        });
    },


    create: function (req, res) { // create the order based on the client information and the cart

        if (!req.session.user) {
            return res.redirect('/login');
        }

        console.log('enter OderController - create');
        console.log('req.body', req.body);
        console.log('test', req.body['name']);

        var result = {
            product: []
        };

        var name = getValueFromReq(req.body, 'name');
        var email = getValueFromReq(req.body, 'email');
        var phone = getValueFromReq(req.body, 'phone');
        var address = getValueFromReq(req.body, 'address');
        var postcode = getValueFromReq(req.body, 'postcode');
        var comment = getValueFromReq(req.body, 'comment');
        var payment = getValueFromReq(req.body, 'payment');
        var cart = getValueFromReq(req.session, 'cart');
        var status = 1;

        // creation of the order json
        var data = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            postcode: postcode,
            comment: comment,
            payment: payment,
            shipping: 0,
            price: 0,
            list_product: [],
            cart: cart,
            status: status
        }

        console.log('order', data);
        console.log('cart session', req.session.cart); // in the cart we have all the product
        console.log('session user', req.session.user);

        req.session['orderReference'] = 0;

        async.waterfall([

            function getNewIdOrder(next) {

                var newIdOrder = CoreReadDbService.getNewIdOrder().then(function (idOrder) {

                    console.log('promise return value - create order - id:', idOrder);

                    req.session['orderReference'] = idOrder;


                    data['idOrder'] = idOrder;

                    CoreInsertDbService.insertOrder(data);
                    console.log('orderController - increment id [START]');

                    console.log('create the order - function 2 - idOrder', next); // test if we get the new id order

                    return res.redirect('/pay/' + idOrder);
                });
            }]);
    }
};

function GetSessionData(req) {
    var result = {
        user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
        cart: (req.session.hasOwnProperty('cart')) ? req.session.cart : undefined
    };

    return result;
}

function getValueFromReq(data, name) {

    var output = '';

    if (data[name]) {
        output = data[name];
    }

    return output;


}
