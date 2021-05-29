var host = sails.config.connections.mongodbServer.host;
var port = sails.config.connections.mongodbServer.port;
var database = sails.config.connections.mongodbServer.database;
var url = "mongodb://" + host + ":" + port + '/' + database;
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');



module.exports = {
    sendAlertEmail: function () {
        var mailOptions = {
            from: sails.config.project.nodemailer.sender, // sender address
            to: sails.config.project.nodemailer.mailToAlert, // send to self
            subject: 'New order created!', // Subject line
            html: '<p>You have new order.</p> Check your admin panel at <a href="' + sails.config.project.website + '/admin/' + '"></a> ' // html body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) return console.log(err);
            else return console.log('Message sent: ' + info.response);
        });
    },

    getNewIdProduct: function () { // initialize the counter for name field, for example the productId

        var fieldName = 'product';
        return this.getNewId(fieldName);

    },



    // will return the max value for idProduct , default will be 1
    getNewId: function (fieldName) { // return the new id product to use


        var MongoClient = require('mongodb').MongoClient;
        return new Promise(
            function (resolve, reject) {
                MongoClient.connect(url, function (err, db) {
                    var col = db.collection('counter');
                    var data = col.find({id: fieldName}).toArray(function (err, docs) {
                        db.close();
                        if (docs[0]) {

                            resolve(docs[0].seq);//docs[0].name.toString()); // returns to the function that calls the callback

                        }
                        else {
                            resolve(1);
                        }
                    });
                })
            })
    },

    getNewIdOrder: function () { // initialize the counter for name field, for example the productId

        var fieldName = 'order';
        return this.getNewId(fieldName);
    },

    getListCoreModule: function () {

        return new Promise(
            function (resolve, reject) {

                var MongoClient = require('mongodb').MongoClient;
                //var fieldName = 'product';

                MongoClient.connect(url, function (err, db) {
                    var collectionName = "core_module";
                    var col = db.collection(collectionName);
                    var data = col.find({}).toArray(function (err, data) {
                        db.close();
                        console.log('getListCoreModule - data', data);
                        resolve(data);//docs[0].name.toString()); // returns to the function that calls the callback
                    });
                })
            })
    },

    getCategoryList: function () { // return the category list

        return new Promise(
            function (resolve, reject) {

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {
                    var collectionName = "category";
                    var col = db.collection(collectionName);
                    var data = col.find({}).toArray(function (err, data) {
                        db.close();
                        console.log('getListCoreModule - data', data);
                        resolve(data);//docs[0].name.toString()); // returns to the function that calls the callback
                    });
                })
            })
    },

    getCategoryItem: function (idCategory) { // return the category item

        return new Promise(
            function (resolve, reject) {

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {
                    var collectionName = "category";
                    var col = db.collection(collectionName);
                    var data = col.find({_id: ObjectId(idCategory)}).toArray(function (err, data) {
                        db.close();
                        console.log('getCategoryItem', data);
                        resolve(data);//docs[0].name.toString()); // returns to the function that calls the callback
                    });
                })
            })
    },


    getListModuleOneCategory: function () {


        // return the list of module for one category

    },

    getListCoreModuleInstalled: function () {

        return new Promise(
            function (resolve, reject) {

                var MongoClient = require('mongodb').MongoClient;
                var fieldName = 'product';

                MongoClient.connect(url, function (err, db) {
                    var collectionName = "core_module_installed";
                    var col = db.collection(collectionName);
                    var data = col.find({}).toArray(function (err, data) {
                        db.close();
                        console.log('getListCoreModule - data', data);
                        resolve(data);//docs[0].name.toString()); // returns to the function that calls the callback
                    });
                })
            })
    },

    getStatusInstallation: function () {

        return new Promise(
            function (resolve, reject) {

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {
                    var collectionName = "installation";
                    var col = db.collection(collectionName);
                    var data = col.find({}).toArray(function (err, data) {
                        db.close();
                        console.log('getStatusInstallation', data);
                        var output;

                        if (data.status == 'done') {
                            output = true;
                        }
                        else {
                            output = false;
                        }

                        resolve(data);//docs[0].name.toString()); // returns to the function that calls the callback
                    });
                })
            })
    },

    getItemPaymentFromOrder: function (idOrder) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collectionName = "order";

                console.log('getItemPaymentFromOrder - idOrder', idOrder);


                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collectionName);

                    col.find({idOrder: parseInt(idOrder)}).toArray(function (err, data) {
                        //db.close();
                        console.log('getItemPaymentFromOrder - data', data);

                        resolve(data);    //docs[0].name.toString()); // returns to the function that calls the callback
                    });
                })
            })

        return promise;
    },



    getOrderItem: function (idOrder) { // return the data and item information about one order


        console.log('service - getOrderItem - start ');

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "order";

                //console.log('getProductItem - idOrder', idOrder);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    //var idProduct = input[0].id;

                    var findQuery = {"idOrder":idOrder};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {

                        console.log(err);

                        console.log('getOrderItem - data', data[0]);

                        var output = data;

                        resolve(output);
                    })
                })
            })

        return promise;
    },


    getOrderList: function () { // return the data and item information about one order


        console.log('service - getOrderList - start ');

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "order";

                //console.log('getProductItem - idOrder', idOrder);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    //var idProduct = input[0].id;

                    var findQuery = {};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {

                        console.log(err);

                        console.log('getOrderItem - data', data[0]);

                        var output = data;

                        resolve(output);
                    })
                })
            })

        return promise;
    },


    getUserItemByEmail: function (email) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "user";

                console.log('getUserItem - email', email);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    var findQuery = {"email": email};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getUserItem - data', data[0]);

                        var output = data[0];

                        resolve(output);
                    })
                })
            })

        return promise;
    },



    getProductItem: function (idProduct) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "product";

                console.log('getProductItem - idProduct', idProduct);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    //var idProduct = input[0].id;

                    var findQuery = {"idProduct": parseInt(idProduct)};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getProductItem - data', data[0]);

                        var output = data[0];

                        resolve(output);    //docs[0].name.toString()); // returns to the function that calls the callback
                    })
                })
            })

        return promise;
    },


    getProductItem: function (idProduct) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "product";

                console.log('getProductItem - idProduct', idProduct);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    //var idProduct = input[0].id;

                    var findQuery = {"idProduct": parseInt(idProduct)};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getProductItem - data', data[0]);

                        var output = data[0];

                        resolve(output);    //docs[0].name.toString()); // returns to the function that calls the callback
                    })
                })
            })

        return promise;
    },

    getProductListFromOneCategory: function (idCategory) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "product";

                console.log('getProductListFromOneCategory - idCategory', idCategory);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    //var idProduct = input[0].id;

                    var findQuery = {"idCategory": idCategory};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getProductListFromOneCategory - data', data);

                        resolve(data);    //docs[0].name.toString()); // returns to the function that calls the callback
                    })
                })
            })

        return promise;
    },

    getProductList: function (idCategory) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "product";

                //console.log('getProductList - idCategory', idCategory);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    var findQuery = {};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getProductList - data', data);

                        resolve(data);    //docs[0].name.toString()); // returns to the function that calls the callback
                    })
                })
            })

        return promise;
    },

    getTotalAmountForOneOrder: function (idOrder) { // return the total amount for one order based on the item list

        var promise = new Promise(
            function (resolve, reject) {

                var collectionName = "order";

                console.log('getTotalAmountForOneOrder - idOrder', idOrder);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collectionName);

                    col.find({idOrder: parseInt(idOrder)}).toArray(function (err, data1) {

                        console.log('getTotalAmountForOneOrder - data1', data1);

                        var item1 = data1[0].cart;
                        var collection2 = 'product';
                        var col2 = db.collection(collection2);

                        var obj_ids = item1.map(function (item) {
                            return ObjectId(item.id)
                        });

                        var findQuery = {"_id": {"$in": obj_ids}}


                        col2.find(
                            findQuery
                        ).toArray(function (err, data2) {

                                console.log('getTotalAmountForOneOrder - data2', data2);

                            var price = 0 ;

                            _.each(data2, function (val, key) {

                                price = price + ( val.price * item1[key].quantity);

                            })


                                //var price = data2[0].price;

                                console.log('price', price);

                                console.log(err);

                                resolve(price);

                            }
                        )
                    });
                })
            })

        return promise;
    },


    returnItemWithPriceForOrder: function (input) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "product";

                console.log('getItemPaymentFromOrder - idOrder', input);

                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                   /* var obj_ids = input.map(function (item) {
                        return ObjectId(item.id)
                    });*/

                    var obj_ids = input.map(function (item) {
                        return item.id
                    });


                    console.log ('returnItemWithPriceForOrder - obj_ids', obj_ids);


                    var findQuery = {"idProduct": {"$in": obj_ids}}

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('returnItemWithPriceForOrder - data', data);

                        resolve(data);
                    })
                })
            })

        return promise;

    },

    getConfigurationModule: function (input) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "core_module_installed";

                // console.log('getItemPaymentFromOrder - idOrder', input);


                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    var findQuery = {name: input};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getConfigurationModule - data', data);

                        resolve(data);
                    })
                })
            })

        return promise;

    },


    getConfigurationOneModule: function (categoryModule, nameModule) { // return the data and item information about one order

        var promise = new Promise(
            function (resolve, reject) {

                var collection = "module_" + categoryModule;

                // console.log('getItemPaymentFromOrder - idOrder', input);


                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    var col = db.collection(collection);

                    var findQuery = {name: nameModule};

                    col.find(
                        findQuery
                    ).toArray(function (err, data) {
                        //db.close();
                        console.log(err);

                        console.log('getConfigurationOneModule - data', data);

                        resolve(data);
                    })
                })
            })

        return promise;

    },


};
