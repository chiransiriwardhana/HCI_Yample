module.exports.routes = {


    'POST /product/save_image/:idProduct': 'core/api/UploadController.saveImageProduct',


    '/api/save_image/module/:moduleName': 'core/api/UploadController.saveImageModule',


    '/payment/paypal/pay/:idPayment': 'core/api/paymentController.paypalPay',


    '/payment/paypal/execute/success/:idPayment': 'core/api/paymentController.paypalExecuteSuccess',


    '/payment/paypal/execute/cancel/:idPayment': 'core/api/paymentController.paypalExecuteCancel',


    '/payment/paypal/execute/confirmation/success/:idPayment': 'core/api/paymentController.paypalExecuteConfirmationSuccess', // double confirmation paypal step


    '/payment/paypal/execute/confirmation/error/:idPayment': 'core/api/paymentController.paypalExecuteConfirmationError', // double confirmation paypal step



    'GET /api/v1/test/': 'core/api/ApiController.test'


};
