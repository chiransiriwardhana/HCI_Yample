var request = require('supertest');

describe('UserController', function() {

    describe('#login()', function() {
        it('should redirect to /mypage', function (done) {
            request(sails.hooks.http.app)
                .get('/api/v1/test/')
                //.send({ name: 'test', password: 'test' })

               // .expect(200, done)

             //   .expect(function(res) {
             //   res.body.data = 'test';
             //   },done)


                .expect(200, {
                    data: 'test'
                }, done);

        });
    });


    describe('#login()', function() {
        it('should redirect to /mypage', function (done) {
            request(sails.hooks.http.app)
                .get('/api/v1/test/')
                //.send({ name: 'test', password: 'test' })

                // .expect(200, done)

                //   .expect(function(res) {
                //   res.body.data = 'test';
                //   },done)


                .expect(200, {
                    data: 'test'
                }, done);

        });
    });

});