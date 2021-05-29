module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/


    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     *  If a request to a URL doesn't match any of the custom routes above, it  *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

    // ADMIN
    // old with menu toogle 'GET    /admin'               : 'core/back/AdminController.index',


    'GET    /admin/new_template/': 'core/back/AdminController.newTemplate',

    'GET    /admin': 'core/back/AdminController.menu',
    '/admin/login': 'core/back/AdminController.login',
    '/admin/logout': 'core/back/AdminController.logout',

    '/admin/login_validation': 'core/back/AdminController.loginValidation',


    'GET    /admin/menu': 'core/back/AdminController.menu',

    // create the new product in db 
    '/admin/product/create/validation': 'core/back/productController.productNewValidation',
    'GET    /admin/product/create': 'core/back/productController.create',
    'GET    /admin/product/list': 'core/back/productController.list',// display all the product available
    'GET    /admin/product/edit/:id': 'core/back/productController.edit',// edit the product
    '/admin/product/edit/validation/:id': 'core/back/productController.editValidation',// save the product modification

    'GET    /admin/product/delete/:id': 'core/back/productController.delete',
    'GET    /admin/product/delete/confirmation/:id': 'core/back/productController.deleteConfirmation',

    // url to use the profile of the admin user
    'GET    /admin/administrator/edit/': 'core/back/UserController.profile',

    //'admin/AdminController.productCreate',

    'GET    /admin/category/list': 'core/back/CategoryController.list',
    'GET    /admin/category/create': 'core/back/CategoryController.create',
    '/admin/category/edit/:id': 'core/back/CategoryController.edit',
    '/admin/category/edit/validation/:id': 'core/back/CategoryController.editValidation',


    '/admin/category/delete/:id': 'core/back/CategoryController.delete',
    '/admin/category/delete/confirmation/:id': 'core/back/CategoryController.deleteConfirmation',

    'POST    /admin/category/create/validation': 'core/back/CategoryController.createValidation',

    'GET    /admin/order/manage': 'core/back/OrderController.manage',

    'GET    /admin/customer/list': 'core/back/CustomerController.user',
    'GET    /admin/customer/item/:idCustomer': 'core/back/CustomerController.item',
    'GET    /admin/customer/edit/:idCustomer': 'core/back/CustomerController.edit',

    // page of admin preference
    'GET    /admin/preference': {view: 'core/back/preference'},

    // install page
    'GET    /admin/install': {view: 'core/install/index'},
    '/install': 'core/install/InstallationController.firstInstallation',

    '/admin/install/database': 'core/install/InstallationController.firstInstallation',

    '/admin/product/preview/:id': 'core/back/productController.preview',

    '/admin/stat/dashboard': 'core/back/statController.dashboard',

    '/admin/stat/report': 'core/back/statController.report',

    '/admin/notification/configuration': 'core/back/Notification.configuration',

    // [start mobile section]

    'GET /admin/mobile/api_token': 'core/back/Mobile.apiToken',

    'GET /admin/mobile/api_token/generate_token': 'core/back/Mobile.apiGenerateToken',
    'POST /admin/mobile/api_token/save_configuration': 'core/back/Mobile.apiSaveToken',




    // [end mobile section]

};
