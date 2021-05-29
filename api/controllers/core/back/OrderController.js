/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var pathTemplateBackCore =  sails.config.globals.templatePathBackCore;
var pathToService = '../../../services/core/';

var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');

module.exports = {
	

  /**
   * `OrderController.manage()`
   */


  manage: function (req, res) {
    var result = {
      admin: req.session.user
    };
    var skip = 0;
    var page = 1;

    if ( req.query.hasOwnProperty('page') ){
      skip = (req.query.page - 1) * 10;
      page = req.query.page;
    }

    /*var queryOptions = {
      where: {},
      skip: skip,
      limit: 10,
      sort: 'createdAt DESC'
    };*/

    result.page = page;

    async.waterfall([

      function GetOrders (next) {

        CoreReadDbService.getOrderList().then(function (data1) {

          console.log ( 'back OrderController - manage - data1', data1);

          result.orders = data1;

          return next(null);
        });
      },

      function GetEditProduct (next) {
        if ( !req.params.hasOwnProperty('id') ) {
          return next(null);
        }

        var orderId = req.params.id;
        CoreReadDbService.getOrderItem(orderId).then(function (order) {


          //if (err) next (err);
          result.edit = order;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);


      result.templateToInclude  = 'yes';

      result.pathToInclude = '../order/list.ejs';

      return res.view(pathTemplateBackCore +'commun-back/main.ejs', result);
    });
  },

  /**
   * `OrderController.list()`
   */
  list: function (req, res) {
    return res.json({
      todo: 'list() is not implemented yet!'
    });
  }
};

