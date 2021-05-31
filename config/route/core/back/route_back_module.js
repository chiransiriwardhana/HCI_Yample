module.exports.routes = {

// page to manage the modules
    'GET    /admin/module': {view: 'core/back/module/index'},
    'GET    /admin/module/create': 'core/back/moduleController.create',
    'GET    /admin/module/list/': 'core/back/moduleController.list',
    // list all the modules for one category
    'GET    /admin/module/list/:nameModule': 'core/back/moduleController.listForOneModule',


    'GET    /admin/module/search': 'core/back/moduleController.search', // return the list of module to be added
    '/admin/module/install/': 'core/back/moduleController.install', // edit a module
    '/admin/module/edit/:nameModule': 'core/back/moduleController.edit', // edit a module
    '/admin/module/edit/validation/:nameModule': 'core/back/moduleController.editValidation', // validate the edit of one module, update the configuration

    '/admin/module/inactivate/:nameModule': 'core/back/moduleController.inactivate', // inactivate a module

    '/admin/module/paypal/': 'core/back/moduleController.paypal',
    '/admin/module/manage/': 'core/back/moduleController.manage',

}