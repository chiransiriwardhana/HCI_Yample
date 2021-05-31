/**
 * CategoryController
 *
 * @description :: Server-side logic for managing Categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');

var pathToService = '../../../services/core/';

var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');

var pathTemplateFrontCore = sails.config.globals.templatePathFrontCore;

var theme = sails.config.globals.theme;


module.exports = {

    listProduct: function (req, res) {
        var result = {
            user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined
        };

        var query = {
            isSelling: true
        }

        console.log('category - list - start ');
        console.log('req query', req.params);


        if (req.query.name) {
            // query.name = new RegExp('/\s?[^a-z0-9\_]'+req.query.name+'[^a-z0-9\_]/i', 'g', 'gi');
            query.name = new RegExp(req.query.name);
            query.name = req.query.name;
            console.info('productController - query.name', query.name);
            product_query = req.query.name;
        }
        else {
            product_query = ''; //default value, return all the product
        }

        async.waterfall([
            function GetProductList(next) {

                //idCategory = 1;
                var idCategory = Number( req.params.id);


                try {

                    CoreReadDbService.getProductListFromOneCategory(idCategory).then(function (data) {

                        console.log('return product list by category', data);

                        result.products = data;

                        return next(null, data);

                    })
                }
                catch (err) {
                    // Handle the error here.
                    console.log(err);

                }
            },

            function getCategoryList(next) {

                var newIdProduct = CoreReadDbService.getCategoryList().then(function (categoryList) {

                    console.log('promise return value categoryList:', categoryList);
                    result.categoryList = categoryList;


                    return res.view(theme + 'index.ejs', result);


                    return next(null, categoryList);
                });

            },

        ], function (err) {
            if (err) return res.serverError(err);

            return res.view(theme + 'index.ejs', result);
        });
    },

};

