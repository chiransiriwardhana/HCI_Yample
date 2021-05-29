/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var async = require('async');
var bcrypt = require('bcryptjs');
var pathToService = '../../../services/core/';
var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');
var CoreFrontInsertDbService = require(pathToService + 'back/CoreFrontInsertDbService');

var pathTemplateFrontCore = sails.config.globals.templatePathFrontCore;


module.exports = {
    profile: function (req, res) {
        var result = {};
        var skip = 0;
        var page = 1;

        if (req.query.hasOwnProperty('page')) {
            skip = (req.query.page - 1) * 10;
            page = req.query.page;
        }

        var queryOptions = {
            where: {},
            skip: skip,
            limit: 10,
            sort: 'createdAt DESC'
        };

        result.page = page;

        result.order = {};


        // we check if the session id user is set.


        if (req.session.user && req.session.user.id) {
        }
        else {


            // if not set we go to the login page


            return res.redirect('/login');

        }


        async.waterfall([
            function GetTotalCount(next) {


                Order.count({owner: req.session.user.id}, function (err, num) {
                    if (err) return next(err);

                    result.pages = [];

                    for (var i = 0, count = parseInt(num / queryOptions.limit); i <= count; i++) {
                        result.pages.push(i + 1);
                    }

                    return next(null);
                });
            },

            function GetUserAndOrders(next) {

                console.info('user id ', req.session.user.id);


                User.findOne(req.session.user.id).populate('orders', queryOptions).exec(function (err, user) {
                    if (err) return next(err);
                    if (!user) return next('NO_USER_FOUND');

                    result.user = user;
                    result.cart = req.session.cart;
                    result.orders = user.orders;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);

            return res.view(pathTemplateFrontCore + 'profile/profile.ejs', result);
        });
    },

    signup: function (req, res) {


        var data = {};

        if (req.body.name && req.body.email && req.body.password) {

            CoreFrontInsertDbService.startCreateUserFront(req);

            console.log('UserController.js - step 1 subscription done');

            return res.redirect('/');
        }
        else {

            return res.redirect('/login');

        }

    },

    update: function (req, res) {
        delete req.body.email;

        console.log(req.body);

        User.update(req.params.id, req.body, function (err, user) {
            if (err) return res.serverError(err);

            return res.redirect('/profile');
        });
    },

    login: function (req, res) {

        console.log('UserController - login');

        async.waterfall([
            function GetUser(next) {





            try {


                var email = req.body.email;

                CoreReadDbService.getUserItemByEmail(email).then(function (user) {




            //User.findOne({'email': req.body.email}).exec(function (err, user) {


                console.log('UserController - login - user', user);

                  //  if (err) return next(err);

                    return next(null, user);
                });
            }
            catch (err) {
                // Handle the error here.
                console.log(err);

            }


            },

            function Validate(user, next) {

                try {

                    if (user && user.password) {

                        bcrypt.compare(req.body.password, user.password, function (err, isSuccess) {
                            if (err) return next(err);

                            if (isSuccess) {
                                req.session.authenticated = true;
                                req.session.user = user;
                            }
                            else { // login view with error message
                                var dataView = [];
                                dataView.message = 'user or password not correct';
                                return res.view(pathTemplateFrontCore + 'login.ejs', dataView);
                            }

                            return next(null, isSuccess);
                        });
                    }
                    else{

                        console.log ('UserController - User not found');

                        // error of user password

                        var url = '/login?error_user=1';

                        return res.redirect(url);

                    }


                }
                catch (err) {
                    // Handle the error here.
                    console.log(err);

                }


            }
        ], function (err, isSuccess) {
            if (err) return res.serverError(err);
            if (!isSuccess) {
                return res.serverError('Or permission. The password is different.');
            }
            else {

                console.log('redirect_url', req.query);

                var url = '/';

                if (req.query.redirect_url) {

                    url = req.query.redirect_url;
                }

                return res.redirect(url);
            }
        });
    },


    loginStep1: function (req, res) {

        console.log('UserController - loginStep1', req.query);

        var redirectUrl = '/';

        if (req.query.redirect_url) {
            redirectUrl = req.query.redirect_url;
        }

        var dataView = [];
        dataView.message = '';
        dataView.redirectUrl = redirectUrl;
        return res.view(pathTemplateFrontCore + 'login.ejs', dataView);

    },

    reset: function (req, res) {
        async.waterfall([
            function GetUser(next) {
                User.findOne({'email': req.body.email}).exec(function (err, user) {
                    if (err) return next(err);

                    return next(null, user);
                });
            },

            function GenSalt(user, next) {
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) return next(err);

                    return next(null, user, salt);
                });
            },

            function Encrypt(user, salt, next) {
                var randomPassword = randomString(10);

                bcrypt.hash(randomPassword, salt, function (err, hash) {
                    if (err) return next(err);

                    user.update({password: hash}, function (err, updatedUser) {
                        updatedUser.newPassword = randomPassword;

                        return next(null, updatedUser);
                    });
                });
            },
        ], function (err, updatedUser) {
            // 수정이 필요함 - 미완성
            if (err) return res.serverError(err);
            if (!updatedUser.newPassword) return res.serverError();

            return res.return(updatedUser);
        });
    },

    logout: function (req, res) {
        req.session.authenticated = false;
        req.session.user = undefined;

        return res.redirect('/');
    },
};

function randomString(length, chars) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';

    for (var i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    return result;
}
