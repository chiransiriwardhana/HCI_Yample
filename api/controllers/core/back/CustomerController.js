/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * @creator :: Fabien Thetis
 */

var async = require('async');
var pathTemplateBackCore =  sails.config.globals.templatePathBackCore;


module.exports = {



    edit: function (req, res) {
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


        var idCustomer = req.params.idCustomer;





        async.waterfall([

            function GetUserAndOrders(next) {

                console.info('user id ', idCustomer);


                User.findOne(idCustomer).populate('orders', queryOptions).exec(function (err, user) {


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



            result.templateToInclude = 'customer_edit';
            result.pathTemplateBackCore = '../customer/edit.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);



        });
    },


    item: function (req, res) {
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


        var idCustomer = req.params.idCustomer;





        async.waterfall([

            function GetUserAndOrders(next) {

                console.info('user id ', idCustomer);


                User.findOne(idCustomer).populate('orders', queryOptions).exec(function (err, user) {
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



            result.templateToInclude = 'customer_item';
            result.pathTemplateBackCore = '../customer/item.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);



        });
    },


    user: function (req, res) {
        var result = {
            admin: req.session.user
        };
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

        async.waterfall([
            function GetTotalCount(next) {
                User.count(function (err, num) {
                    if (err) return next(err);

                    result.pages = [];

                    for (var i = 0, count = parseInt(num / queryOptions.limit); i <= count; i++) {
                        result.pages.push(i + 1);
                    }

                    return next(null);
                });
            },

            function GetUsers(next) {
                User.find(queryOptions).populate('orders').exec(function (err, users) {
                    if (err) return next(err);

                    result.users = users;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);


            // we add the name of the template to include

            result.templateToInclude = 'customer_list';
            result.pathToInclude = '../customer/list.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    }

}
