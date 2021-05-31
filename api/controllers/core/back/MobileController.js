var async = require('async');

var Promise = require('bluebird');
var pathToService = '../../../services/core/';
var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + '/back/CoreInsertDbService');
var pathTemplateBackCore = sails.config.globals.templatePathBackCore;
var _ = require('underscore');
var hat = require('hat');


module.exports = {


    apiToken: function (req, res) {

        var api_key = '';

        if (req.query.api_key) {
            var apiKey = req.query.api_key;

            console.log('apiToken - apiKey', apiKey);
        }

        var data = {};


        data.pathToInclude = '../mobile/api-token.ejs';
        data.api_key = apiKey;


        return res.view(pathTemplateBackCore + 'commun-back/main.ejs', data);


        return res.ok('ok pour api token ');

    },


    apiGenerateToken: function (req, res) {

        var result = {};
        var id = hat();

        console.log('MobileController' + id);

        var url = '/admin/mobile/api_token?api_key=' + id;

        return res.redirect(url);
    },

    // store the token in table api
    apiSaveToken: function (req, res) {

        var apiKey = '';
        if (req.body.api_key) {
            apiKey = req.body.api_key;
        }

        CoreInsertDbService.saveApiKey(apiKey);

        console.log('apiSaveToken - apiKey', apiKey);

        var result = {};

        var url = '/admin/mobile/api_token?api_key=' + apiKey;

        return res.redirect(url);
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

                    // in this case the configuration paypal is missing
                    if (typeof configurationModule[0] == "undefined"){

                        var url = '/?error_configuration_paypal';
                        return res.redirect(url);

                    }

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
    }
}


