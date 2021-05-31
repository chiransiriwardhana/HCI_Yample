module.exports.module = {

    /***************************************************************************
     *                                                                          *
     * Your app's default connection. i.e. the name of one of your app's        *
     * connections (see `config/connections.js`)                                *
     *                                                                          *
     ***************************************************************************/
    category: {

        template: {
            carousel: {
                isActive: "1",
                pathCarouselImage: '/assets/images/carousel/',
                pathToInclude:  '../module/template/carousel/edit.ejs'
            },

            footer: {

                isActive: "0"
            }
        },

        payment: {

            paypal: {

                isActive: 1,

                back: {
                    controller: "xx",
                    service: "xx",
                    template: "xx"
                },
                front: {

                    controller: "xx",
                    service: "xx",
                    template: "xx"
                }
            }

        },

        /***************************************************************************
         *                                                                          *
         * How and whether Sails will attempt to automatically rebuild the          *
         * tables/collections/etc. in your schema.                                  *
         *                                                                          *
         * See http://sailsjs.org/#/documentation/concepts/ORM/model-settings.html  *
         *                                                                          *
         ***************************************************************************/
        migrate: 'xx'

    }

}