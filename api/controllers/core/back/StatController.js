/**
 * back/statController
 *
 * @description :: Server-side logic for managing admin/products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var Promise = require('bluebird');

module.exports = {


    dashboard: function (req, res) {

        console.log('[start]: productController - preview ');

        return res.ok('dashboard');

    },

    report: function (req, res) {

        console.log('[start]: productController - preview ');

        return res.ok('dashboard');

    }




};

function Urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
};

