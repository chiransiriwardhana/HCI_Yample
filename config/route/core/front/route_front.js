module.exports.routes = {

    // INDEX
    'GET    /': 'core/front/ProductController.list',
    'GET    /category/:id': 'core/front/CategoryController.listProduct',


    'GET    /login': 'core/front/UserController.loginStep1',
    'GET    /account': {view: 'core/front/account'},

    // USER
    'POST   /login': 'core/front/UserController.login',
    '/login': 'core/front/UserController.login',

    'POST   /signup': 'core/front/UserController.signup',
    'POST   /reset': 'core/front/UserController.reset',
    'GET    /logout': 'core/front/UserController.logout',
    'GET    /profile': 'core/front/UserController.profile',

    // PRODUCT
    'GET    /product/:id': 'core/front/ProductController.view',
    'GET    /product/status/:id': 'core/front/ProductController.status',

    // ORDER & CART
    'GET    /cart': 'core/front/CartController.index',
    'PUT    /cart/apply/:id': 'core/front/CartController.apply',
    'GET    /cart/add/:id': 'core/front/CartController.add',
    'GET    /cart/buy/:id': 'core/front/CartController.add',
    'GET    /cart/clear': 'core/front/CartController.clear',
    'DELETE /cart/:id': 'core/front/CartController.delete',
    'GET    /checkout': 'core/front/CartController.checkout',

    'POST   /paid': 'core/front/OrderController.paid',
    '/pay/:id': 'core/front/OrderController.pay',
    '/order': 'core/front/OrderController.create',
    'GET    /order/cancel/:id': 'core/front/OrderController.cancel',
    'GET    /order/delivery/:id': 'core/front/OrderController.delivery',
    'GET    /order/check': 'core/front/OrderController.check',
    'GET    /order/change': 'core/front/OrderController.change',

    // FILE & UPLOAD
    'GET    /upload': 'core/front/FileController.upload',
    'GET    /image/:id': 'core/front/FileController.retrieve',
    'GET    /test': 'core/front/FileController.test',
    'GET    /subscription_newsletter': 'core/front/SubscriptionController.newsletter' //add in table front_subscription_newsletter data


}