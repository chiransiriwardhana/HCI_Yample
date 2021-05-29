/**
 * Admin/productController
 *
 * @description :: Server-side logic for managing admin/products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

var async = require('async');

var pathToService = '../../../services/core/';

var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');
var CoreDeleteDbService = require(pathToService + 'back/CoreDeleteDbService');

var pathTemplateBackCore = sails.config.globals.templatePathBackCore;

//module.exports = CoreReadDbService;


module.exports = {

    /**
     * `Admin/productController.new()`
     */
    create: function (req, res) {
        var result = {};

        async.waterfall([

            function getNewIdProducT(next) {

                CoreReadDbService.getNewIdProduct().then(function (idProduct) {

                    console.log('new product id:', idProduct);

                    result.idProduct = idProduct;

                    CoreReadDbService.getCategoryList().then(function (categoryList) {

                        console.log('ProductController - categoryList', categoryList);

                        result.categoryOption = categoryList;
                        result.templateToInclude = 'product';
                        result.pathToInclude = '../product/create';

                        return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

                    })

                    return next(null, idProduct);
                });
            }

        ]);
    },

    preview: function (req, res) {


        var productId = req.params.id;

        console.log('product id : ', productId);

        CoreReadDbService.getProductItem(productId).then(function (data) {

            console.log('return full product preview ', data);

            var result = {};

            result.product = data;

            result.templateToInclude = 'product_preview';
            result.pathToInclude = '../product/preview.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        });
    },

    list: function (req, res) {


        CoreReadDbService.getProductList().then(function (data) {

            console.log('return full product list ', data);

            var result = {};

            result.products = data;

            result.templateToInclude = 'product_list';
            result.pathToInclude = '../product/list.ejs';
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    },

    edit: function (req, res, id) {

        var result = {};
        console.info('modification product id: ', req.params.id);
        console.info(req.params.id.length);

        if (req.params.id && (req.params.id.length > 0 )) {
            // we retrieve the product informations
            var productId = req.params.id;

            CoreReadDbService.getProductItem(productId).then(function (products) {

                result.product = {};
                result.product = products;

                if (products.idProduct) {
                    result.idProduct = products.idProduct;
                }
                else {
                    result.idProduct = 0;
                }

                CoreReadDbService.getCategoryList().then(function (categoryList) {

                    console.log('ProductController - categoryList', categoryList);

                    result.categoryOption = categoryList;

                    console.info('edit query result', products);
                    console.info('edit - result', result);
                    result.templateToInclude = 'product_edit';
                    result.pathToInclude = '../product/edit.ejs';
                    return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
                })

            });

        }
        else {
            result.templateToInclude = 'productModification';
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        }
    },

    deleteConfirmation: function (req, res, id) {

        var result = {};
        console.info('modification product id: ', req.params.id);
        console.info(req.params.id.length);

        if (req.params.id && (req.params.id.length > 0 )) {
            // we retrieve the product informations
            var productId = req.params.id;


            CoreDeleteDbService.deleteProduct(productId);

            result.templateToInclude = 'product_delete_ok';
            result.pathToInclude = '../product/delete-ok.ejs';
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);


        }
        else {
            result.templateToInclude = 'product_list';
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        }
    },


    delete: function (req, res, id) {  // display the delete page for validation

        var result = {};

        //console.info('modification product id: ', req.params.id);

        if (req.params.id && (req.params.id.length > 0 )) {
            // we retrieve the product informations
            var productId = req.params.id;


            result.templateToInclude = 'product_delete';
            result.pathToInclude = '../product/delete.ejs';
            result.idProduct = productId;

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        }
    },


    editValidation: function (req, res) {

        console.info('req');
        console.info(req.body);

        if (req && req.body && req.body.name) {
            var data = {};

            data = req.body;

            CoreInsertDbService.updateProduct(data);

            var result = {};

            result.templateToInclude = 'product_edit_ok';
            result.pathToInclude = '../product/edit-ok.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

            console.log('productController - productNewValidation - req.body', data);

        }
        else {
            //var result = {};
            //result.templateToInclude = 'product_edit_ok';
            //return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        }
    },


    productNewValidation: function (req, res) {

        console.info('req');
        console.info(req.body);

        if (req && req.body && req.body.name) {
            var data = {};

            data = req.body;

            CoreInsertDbService.insertProduct(data);

            CoreInsertDbService.incrementId('product');

            var result = {};

            result.templateToInclude = 'productCreationOk';
            result.pathToInclude = '../product/creationOk.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

            console.log('productController - productNewValidation - req.body', data);

            /* Product.create(data, function (err, product) {
             if (err) {
             return res.serverError(err);
             }
             else {

             // once created we increment the id produit in counter table
             //return res.ok('create of the product done', req.body);
             }
             //return res.redirect('/admin/product');
             });*/
        }
        else {
            var result = {};
            result.templateToInclude = 'productCreationKo';
            result.pathToInclude = '../product/creationKo.ejs';
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
            //return res.ok('missing one parameter');
        }
    },

};

function Urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
};

