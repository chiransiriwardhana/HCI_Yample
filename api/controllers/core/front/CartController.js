/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var pathTemplateFrontCore = sails.config.globals.templatePathFrontCore;

var pathToService = '../../../services/core/';
var async = require('async');
var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');

module.exports = {
    index: function (req, res) {
        var result = {
            user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
            total: 0,
            summary: 0
        };

        async.waterfall([
            function GetProduct(next) {
                if (!req.session.hasOwnProperty('cart'))
                    req.session.cart = [];

                var products = req.session.cart;
                var cart = [];

                async.map(products, function (item, done) {

                    CoreReadDbService.getProductItem(item.id).then(function (data) {

                        if (!data) {
                            req.session.cart.splice(data.indexOf(item), 1);
                            return done(null);
                        }

                        var prodcutInfo = {
                            id: data.idProduct,
                            name: data.name,
                            price: data.price,
                            quantity: item.quantity
                        };

                        console.log('CartController - prodcutInfo', prodcutInfo);

                        cart.push(prodcutInfo);
                        return done(null, data);
                    });
                }, function (err) {
                    if (err) return res.serverError(err);

                    result.cart = cart;

                    for (var i in cart) {
                        result.summary += cart[i].price * cart[i].quantity;
                        result.total += cart[i].quantity;
                    }

                    return next(null, result);
                });
            }
        ], function (err, result) {
            if (err) return res.serverError(err);

            return res.view(pathTemplateFrontCore + 'cart/cart.ejs', result);
        });
    },

    add: function (req, res) {


        var productId = req.params.id;

        CoreReadDbService.getProductItem(productId).then(function (data) {



            //  Product.findOne(req.params.id, function (err, product) {
            //if (err) return res.serverError(err);
            if (!data) return res.serverError('NO_PRODUCT_FOUND');


            console.log('CartController - add - req', req.query)

            var quantity = 1;

            if (req.query.quantity) {
                quantity = req.query.quantity
            }


            AddToSessionCart(req.session, data.idProduct, quantity);
            return res.json(req.session.cart);
        });
    },

    apply: function (req, res) {
        var cart = req.session.cart;
        var id = req.params.id;
        var quantity = parseInt(req.query.quantity);

        for (var i in cart) {
            if (cart[i].id == id) {
                req.session.cart[i].quantity = quantity;
            }
        }

        return res.json(cart);
    },

    delete: function (req, res) {
        var cart = req.session.cart;
        var id = req.params.id;
        var quantity = parseInt(req.query.quantity);

        for (var i in cart) {
            if (cart[i].id == id) {
                req.session.cart.splice(i, 1);
            }
        }

        return res.json(cart);
    },

    clear: function (req, res) {
        req.session.cart = [];
        return res.redirect('/cart');
    },

    checkout: function (req, res) {


        // need to check the login status
        var isLogin = false;

        if (req.session.user) {
            isLogin = true;
        }

        var result = {
            user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
            total: 0,
            summary: 0,
            isLogin: isLogin
        };

        async.waterfall([
            function GetCart(next) {
                if (!req.session.hasOwnProperty('cart') || req.session.cart.length <= 0) {
                    next('NO_PRODUCT_IN_CART');
                    return;
                }

                var products = req.session.cart;
                var cart = [];

                async.map(products, function (item, done) {


                    CoreReadDbService.getProductItem(item.id).then(function (data) {


                        if (!data) done('NO_PRODUCT_FOUND');
                        if (data.stock === 0 || ( data.stock !== -1 && data.stock - item.quantity <= 0 )) done('SOLD_OUT');

                        var prodcutInfo = {
                            id: data.idProduct,
                            name: data.name,
                            price: data.price,
                            quantity: item.quantity
                        };

                        cart.push(prodcutInfo);
                        done(null, data);
                    });
                }, function (err) {
                    if (err) return res.serverError(err);

                    result.cart = cart;

                    for (var i in cart) {
                        result.summary += parseInt(cart[i].price) * parseInt(cart[i].quantity);
                        result.total += cart[i].quantity;
                    }

                    next(null, result);
                    return;
                });
            }
        ], function (err, result) {
            if (err) return res.serverError(err);

            return res.view(pathTemplateFrontCore + 'checkout/checkout.ejs', result);
        });
    },

    // Disable default RESTful blueprint routes
    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    }
};


function AddToSessionCart(session, id, quantity) {
    var product = {
        id: id,
        quantity: parseInt(quantity)
    };

    if (session.hasOwnProperty('cart')) {
        var cart = session.cart;
        var isAlreadyExist = false;

        for (var i in cart) {
            if (cart[i].id == id) {
                session.cart[i].quantity += parseInt(quantity);
                isAlreadyExist = true;
            }
        }

        if (!isAlreadyExist)
            session.cart.push(product);
    } else {
        session.cart = [];
        session.cart.push(product);
    }
}
