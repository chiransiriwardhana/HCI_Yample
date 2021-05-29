/**
 * InstallationController
 *
 * @description :: Server-side logic for managing installations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pathToService = '../../../services/core/';


var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');
var CoreInitDbService = require(pathToService + 'back/CoreInitDbService');
var pathTemplateBackCore =  sails.config.globals.templatePathBackCore;

module.exports = {


    firstInstallation: function (req, res) { // first command execute , need to be checked if already used

        console.log('[START]: firstInstallation');


        CoreReadDbService.getStatusInstallation().then(function (data) {


            var msg = '';

            if (data == false) {

                CoreInitDbService.initTableStatus();
                CoreInitDbService.setInstallationDone();
                CoreInsertDbService.createUserAdminDefault();
                CoreInsertDbService.installCounter('order'); // create the collection order
                CoreInsertDbService.installCounter('product'); // create the collection product
                CoreInsertDbService.installCounter('category');
                CoreInsertDbService.firstInstallCoreModule('paypal');
                CoreInsertDbService.firstInstallCoreModule('stripe');

                msg = 'Installation Database done + creation default admin user ( admin / admin), you can go to /admin';

            }
            else {

                msg = 'Installation already done';
            }

            console.log('[END]: firstInstallation');
            var dataView = []; //{status: msg};
            dataView.templateToInclude = 'install_installation_done';
            dataView.pathToInclude = '../../install/installation_done.ejs';
            dataView.status = msg;
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', dataView);


           // return res.view('install/installation_done.ejs', dataView);
        })
    },

    /**
     * `InstallationController.initDatabaseCounter()`
     */
    initCounterProduct: function (req, res) {
        var counterType = 'product';
        CoreInsertDbService.initCounterProduct(counterType);
        return res.json({
            todo: 'initDatabaseCounter() done'
        });
    },

    initCounterOrder: function (req, res) { //
        var counterType = 'order';
        CoreInsertDbService.initCounterOrder(counterType);

        return res.json({
            todo: 'initDatabaseCounter() done'
        });
    }
};

