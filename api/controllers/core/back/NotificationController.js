/**
 * NotificationController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');

var CoreDeleteDbService = require('../../../services/core/back/CoreDeleteDbService');

var CoreReadDbService = require('../../../services/core/back/CoreReadDbService');
var CoreInsertDbService = require('../../../services/core/back/CoreInsertDbService');
var pathTemplateBackCore =  sails.config.globals.templatePathBackCore;

module.exports = {

    configuration: function (req, res) {

        var result = {};

        result.templateToInclude = 'category_create';
        result.pathToInclude = '../notification/configuration';

        return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
    }
}

