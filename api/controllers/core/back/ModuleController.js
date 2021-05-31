/**
 * Admin/productController
 *
 * @description :: Server-side logic for managing admin/products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');

var Promise = require('bluebird');
var pathToService = '../../../services/core/';
var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + '/back/CoreInsertDbService');
var pathTemplateBackCore = sails.config.globals.templatePathBackCore;
var _ = require('underscore');


module.exports = {


    manage: function (req, res) {

        CoreReadDbService.getListCoreModuleInstalled().then(function (data) {

            console.log('ModuleController - search', data);

            var result = {};
            result.templateToInclude = 'module_manage';
            result.pathToInclude = '../module/manage.ejs';
            result.idProduct = 0;
            result.listCoreModule = '';
            if (data) {
                result.listModule = data;
            }
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        });

    },

    /**
     * `Admin/productController.new()`
     */
    create: function (req, res) {

        async.waterfall([

            function getNewIdProducT(next) {

                var newIdProduct = CoreReadDbService.getNewIdProduct('product').then(function (idProduct) {

                    console.log('promise return value:', idProduct);

                    //return doc;

                    return next(null, idProduct);
                    //return res.json({photos: photos.length});
                });
            }

        ], function (err, data) {
            if (err) {
                return res.serverError(err);
            }
            else {
                console.log('productController - result', data);

                var result = {};
                result.templateToInclude = 'installNew';
                result.pathToInclude = '../module/manage.ejs';
                result.idProduct = data;
                return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

            }
        });

        //result.templateToInclude  = 'adminUserProfile';

        //return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
    },


    /*     function (req, res) {

     // get the new idProduct

     //console.log('create test service - last id', ReadDbService.getNewIdProduct());

     async.waterfall([

     var newIdProduct = ReadDbService.getNewIdProduct('product').then(function(doc){

     console.log('promise return value:', doc);

     return doc;


     //return res.json({photos: photos.length});
     });*/

    detail: function (req, res) {
        var result = {
            user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined
        };

        async.waterfall([
            function GetProduct(next) {
                Product.findOne(req.params.id, function (err, product) {
                    if (err) return res.serverError(err);
                    if (!product) return res.serverError('NO_PRODUCT_FOUND');

                    // URLIFY
                    //product.description = Urlify(product.description);

                    result.cart = req.session.cart;
                    result.product = product;

                    return next(null, result);
                });
            }
        ], function (err, result) {
            if (err) res.serverError(err);

            return res.view(pathTemplateBackCore + 'product/detail.ejs', result);
        });
    },


    // list all the module for one category
    listForOneModule: function (req, res) {
        console.log('getListModuleOneCategory - req', req.params);


        var result = [];
        result.listModule = [];

        if (req.params && req.params.nameModule) {

            var nameModule = req.params.nameModule;

            if (nameModule == "deliver") {

                var item = {

                    idModule: 0,
                    category: "delivery",
                    configuration: "",
                    description: "",
                    createAt: "",
                    name: nameModule,
                    isActive: 1
                };

                result.listModule.push(item);

            }
            else if (nameModule == "theme") {

                var item = {

                    idModule: 0,
                    category: nameModule,
                    configuration: "",
                    description: "",
                    createAt: "",
                    name: "carousel",
                    isActive: 1
                };

                result.listModule.push(item);

            }
            else if (nameModule == "payment") {

                var item = [{

                    idModule: 0,
                    category: nameModule,
                    configuration: "",
                    description: "",
                    createAt: "",
                    name: "paypal",
                    isActive: 1
                },
                    {

                        idModule: 0,
                        category: nameModule,
                        configuration: "",
                        description: "",
                        createAt: "",
                        name: "stripe",
                        isActive: 1
                    }];

                result.listModule = item;

            }

            result.templateToInclude = 'list_module';
            result.pathToInclude = '../module/list.ejs';
            result.idProduct = 0;
            result.listCoreModule = '';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        }

        CoreReadDbService.getListModuleOneCategory().then(function (data) {

            console.log('ModuleController - search', data); // add the module list from the configuration file
            var configurationModuleTemplate = sails.config.module.category.template;
            console.log('configurationModule', configurationModuleTemplate);

            var connections = require('../../../../config/module');

            console.log('connections', connections.module.category.template);

            var result = {};
            if (data) {
                result.listModule = data;
            }
            try {

                _.each(configurationModuleTemplate, function (val, key) {
                    var item = {

                        idModule: 0, category: "template", configuration: "", description: "", createAt: "", name: key,
                        isActive: val.isActive
                    };

                    result.listModule.push(item);

                })

            } catch (err) {
                // Handle the error here.
                console.log(err);

            }

            result.templateToInclude = 'list_module';
            result.pathToInclude = '../module/list.ejs';
            result.idProduct = 0;
            result.listCoreModule = '';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        });
    },


    list: function (req, res) {


        CoreReadDbService.getListCoreModuleInstalled().then(function (data) {

            console.log('ModuleController - search', data); // add the module list from the configuration file
            var configurationModuleTemplate = sails.config.module.category.template;
            console.log('configurationModule', configurationModuleTemplate);

            var connections = require('../../../../config/module');

            console.log('connections', connections.module.category.template);

            var result = {};
            if (data) {
                result.listModule = data;
            }
            try {

                _.each(configurationModuleTemplate, function (val, key) {
                    var item = {

                        idModule: 0, category: "template", configuration: "", description: "", createAt: "", name: key,
                        isActive: val.isActive
                    };

                    result.listModule.push(item);

                })

            } catch (err) {
                // Handle the error here.
                console.log(err);

            }

            result.templateToInclude = 'list_module';
            result.pathToInclude = '../module/list.ejs';
            result.idProduct = 0;
            result.listCoreModule = '';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        });
    },


    productNewValidation: function (req, res) {
        console.info(req.body);

        if (req && req.body && req.body.name) {
            var data = {};

            data = req.body;

            CoreInsertDbService.insertProduct(data);

            CoreInsertDbService.incrementId('product');

            var result = {};

            result.templateToInclude = 'productCreationOk';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

            console.log('productController - productNewValidation - req.body', data);
        }
        else {
            var result = {};
            result.templateToInclude = 'productCreationKo';
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        }
    },

    search: function (req, res) { // read data from the core_module database and go back to module/create with the list of modules available


        CoreReadDbService.getListCoreModule().then(function (data) {

            console.log('ModuleController - search', data);

            var result = {};
            result.templateToInclude = 'moduleInstallNew';
            result.pathToInclude = '../module/installNew';
            result.idProduct = 0;
            result.listCoreModule = '';
            if (data) {
                result.listCoreModule = data;
            }
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        });
    },

    install: function (req, res) { // read data from the core_module database and go back to module/create with the list of modules available

        var output;
        //var allParam = req.params.all(); // get the module name and add it in the db and table module with the configuration

        //console.log('ModuleController - install - reqAllParam', allParam); // name contains the name of the module to install

        /*if (allParam.moduleToInstall) {

            var moduleToInstall = allParam.moduleToInstall;

            console.log('ModuleController - install - moduleToInstall', moduleToInstall);

            CoreInsertDbService.installAndActiveCoreModule(moduleToInstall);// we add a line to the module table

            var result = {};
            result.nameModule = moduleToInstall;
            result.templateToInclude = 'installModuleDone';
            result.pathToInclude = '../module/installModuleDone.ejs';
            output = res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        }*/



        var result = {};
        //result.nameModule = moduleToInstall;
        result.templateToInclude = 'installModuleDone';
        result.pathToInclude = '../module/installNew.ejs';
        output = res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);




        return output;
    },

    edit: function (req, res) {

        var nameModule = req.params.nameModule;

        console.log('ModuleController - edit - nameModule', nameModule);


        var result = {};

        //check if module configuration is in json file

        if (checkIfConfigurationIsInJsonFile(nameModule)) {
            result.templateToInclude = 'edit_module';
            result.pathToInclude = '../module/template/carousel/edit.ejs';
            result.moduleName = nameModule;

            //view_module_payment_'+nameModule; //result.listConfiguration = configurationModule[0].configuration; //[];
            result.listConfiguration = null; //[];//console.log('ModuleController - edit', req.params.nameModule);

            result.nameModule = nameModule;

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        } else {

            if (nameModule.toLowerCase() == "paypal") {

                console.log('display paypal edit page');

                result.templateToInclude = 'yes';
                result.pathToInclude = '../module/payment/config-paypal.ejs';
                //view_module_payment_'+nameModule; //result.listConfiguration = configurationModule[0].configuration; //[]; // console.info('listConfiguration', result.listConfiguration);

                console.log('ModuleController - edit', req.params.nameModule);

                result.nameModule = nameModule;

                var categoryModule = 'payment';

                CoreReadDbService.getConfigurationOneModule(categoryModule, nameModule).then(function (configurationModule) {

                    console.log('data configuration paypal', configurationModule);

                    result.configuration = configurationModule[0];

                    return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
                })
            }

            else {

                CoreReadDbService.getConfigurationModule(nameModule).then(function (configurationModule) {

                    try {

                        console.log('listconfiguration', configurationModule[0].configuration);
                        result.templateToInclude = 'edit_module';
                        result.pathToInclude = '../module/edit.ejs';
                        //view_module_payment_'+nameModule;

                        result.listConfiguration = configurationModule[0].configuration; //[];

                        console.info('listConfiguration', result.listConfiguration);

                        console.log('ModuleController - edit', req.params.nameModule);

                        result.nameModule = nameModule;

                    }
                    catch (err) {
                        console.log('err', err);
                    }

                    //{userNameApi:'userNameApi',passwordApi:'passwordApi'};

                    return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

                });
            }


        }
    },

    inactivate: function (req, res, nameModule) {

        console.log('ModuleController - inactivate', nameModule);
    },


    editValidation: function (req, res) { // validate the edit of one module


        try {
            var allParam = req.allParams();
            // get the parameters and update the table core_module_installed ( field configuration , field is active)
            console.log('ModuleController.js - editValidation - req', allParam);

            if (allParam.nameModule && allParam.nameModule == "paypal") {

                var category = 'payment';
                var nameModule = allParam.nameModule;

                if (allParam.mode && allParam.client_id && allParam.client_secret && allParam.client_id.length > 0 && allParam.client_secret.length > 0) {


                    console.log('set configuration paypal in db ');
                    // we set in db module paypal a line collection name is module_category_moduleName
                    var collectionName = 'module_payment';
                    var client_id = allParam.client_id;
                    var client_secret = allParam.client_secret;

                    var mode = 'sandbox';

                    if (allParam.mode) {
                        mode = allParam.mode;
                    }

                    var dataToInsert = {
                        'client_id': client_id,
                        'client_secret': client_secret,
                        'mode': mode,
                        'name': nameModule,
                        'category': category
                    };
                    console.log('insert data in module paypal');
                    CoreInsertDbService.insertModuleConfiguration(collectionName, nameModule, dataToInsert);

                }

                else {

                    return res.ok('One parameter is missing or not correct.');
                }

            }

        }
        catch (err) {
            console.log('ModuleController - err', err);
        }

        var result = [];

        result.pathToInclude = '../module/editOk.ejs';
        result.nameModule = allParam.nameModule;

        return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);

        //return res.ok('Edit is done', req.body);
    },


    paypal: function (req, res) {

        var paypal = require('paypal-rest-sdk');
        //Create config options, with parameters (mode, client_id, secret).

        paypal.configure({

            'mode': 'sandbox', //sandbox or live
            'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
            'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
        });
        // For multiple configuration support, have a look at the sample
        // Invoke the rest api (eg: store a credit card) with required parameters (eg: data, config_options, callback).

        var card_data = {
            "type": "visa",
            "number": "4417119669820331",
            "expire_month": "11",
            "expire_year": "2018",
            "cvv2": "123",
            "first_name": "Joe",
            "last_name": "Shopper"
        };

        paypal.creditCard.create(card_data, function (error, credit_card) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log("Create Credit-Card Response");
                console.log(credit_card);
            }
        })

        return res.ok('paypal paiementmissing one parameter');


        /*      var create_payment_json = {
         "intent": "sale",
         "payer": {
         "payment_method": "credit_card",
         "funding_instruments": [{
         "credit_card": {
         "type": "visa",
         "number": "4417119669820331",
         "expire_month": "11",
         "expire_year": "2018",
         "cvv2": "874",
         "first_name": "Joe",
         "last_name": "Shopper",
         "billing_address": {
         "line1": "52 N Main ST",
         "city": "Johnstown",
         "state": "OH",
         "postal_code": "43210",
         "country_code": "US"
         }
         }
         }]
         },
         "transactions": [{
         "amount": {
         "total": "7",
         "currency": "USD",
         "details": {
         "subtotal": "5",
         "tax": "1",
         "shipping": "1"
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
         });
         */
    }


};


function checkIfConfigurationIsInJsonFile(moduleName) {


    var output = false;

    if (moduleName == 'carousel') {

        output = true;

    }

    return output;


}

function Urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
};

