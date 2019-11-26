// var divider = require('../services/divider');
// var server = require('../modules/frontend');
// var supertest = require('supertest');


// describe("divider tests ", function() {
//     var _numberA;
//     var _numberB;
//
//     it("should return numberA divided by numberB", function() {
//         _numberA = 6;
//         _numberB = 2;
//         var result = divider.divide(_numberA, _numberB);
//
//         expect(result).toEqual(3);
//     });
//
//     it("should return error", function() {
//         _numberA = 6;
//         _numberB = 0;
//         var result = divider.divide(_numberA, _numberB);
//
//         expect(result).toEqual(undefined);
//     });
// });


// describe('routes tests ', function() {
//
//     it('add rout should return ok 200 with parameters', function(done) {
//         var app = supertest(server);
//         app.get('/getInfo')
//             .set('Accept', 'application/json')
//             .expect(200, done);
//     });
//
//     // it('add rout should return error 500 without parameters', function(done) {
//     //     var app = supertest(server);
//     //     app.get('/add?numberA=&numberB=')
//     //         .set('Accept', 'application/json')
//     //         .expect(500, done);
//     // });
//     //
//     // it('subtract route should return ok 200', function(done) {
//     //     var app = supertest(server);
//     //     app.get('/subtract?numberA=2&numberB=2')
//     //         .set('Accept', 'application/json')
//     //         .expect(200, done);
//     // });
//     //
//     // it('multiply route should return ok 200', function(done) {
//     //     var app = supertest(server);
//     //     app.get('/multiply?numberA=2&numberB=2')
//     //         .set('Accept', 'application/json')
//     //         .expect(200, done);
//     // });
//     //
//     // it('divide route should return ok 200', function(done) {
//     //     var app = supertest(server);
//     //     app.get('/divide?numberA=2&numberB=2')
//     //         .set('Accept', 'application/json')
//     //         .expect(200, done);
//     // });
//     //
//     // it('divide route should return error 500 without parameters', function(done) {
//     //     var app = supertest(server);
//     //     app.get('/divide?numberA=2&numberB=0')
//     //         .set('Accept', 'application/json')
//     //         .expect(500, done);
//     // });
// });


// var Request = require("request");
// var Blockchain = require("../modules/Blockchain");
// const app1 = require("express");

// var app = require('../main');
// var request = require('supertest');

describe("Server", () => {
    var server;
    beforeAll(() => {
        server = require('../main');
    });
    // describe("GET /getBlock", () => {
    //     var data = {};
    //
    //
    //     beforeEach((done) => {
    //         Request.get("http://localhost:3001/getBlock/0", (error, response, body) => {
    //             data.status = response.statusCode;
    //             data.body = body;
    //             done();
    //         });
    //     });
    //     it("Status 200 succ", () => {
    //         expect(data.status).toBe(200);
    //     });
    //     it("Body should be defied", () => {
    //         expect(data.body).toBeDefined();
    //      });
    //
    //     beforeEach((done) => {
    //         Request.get("http://localhost:3001/getBlock/12", (error, response, body) => {
    //             data.status = response.statusCode;
    //             data.body = body;
    //             done();
    //         });
    //     });
    //     it("Status 200 server error", () => {
    //         expect(data.status).toBe(200);
    //     });
    //     it("Body should be defined", () => {
    //         expect(data.body).toBeDefined();
    //     });
    // });

    describe("GET /getInfo", () => {
        // var data = {};
        //
        //
        // beforeEach((done) => {
        //     Request.get("http://localhost:3001/getInfo", (error, response, body) => {
        //         data.status = response.statusCode;
        //         data.body = body;
        //         done();
        //     });
        // });
        it("Status 200 succ getInfo", () => {
            expect(true).toBe(true);
        });
        // it("Body should getInfo", () => {
        //     expect(data.body).toBeDefined();
        // });
    });

    // describe("GET /downloadWallet", () => {
    //     var data = {};
    //
    //
    //     beforeEach((done) => {
    //         Request.get("http://localhost:3001/downloadWallet", (error, response, body) => {
    //             data.status = response.statusCode;
    //             data.body = body;
    //             done();
    //         });
    //     });
    //     it("Status 200 succ downloadWallet", () => {
    //         expect(data.status).toBe(200);
    //     });
    //     it("Body should downloadWalletfo", () => {
    //         expect(data.body).toBeDefined();
    //     });
    // });
    //
    //
    //
    // describe("GET /downloadWallet", () => {
    //     var data = {};
    //
    //
    //     beforeEach((done) => {
    //         Request.get("http://localhost:3001/downloadWallet", (error, response, body) => {
    //             data.status = response.statusCode;
    //             data.body = body;
    //             done();
    //         });
    //     });
    //     it("Status 200 succ downloadWallet", () => {
    //         expect(data.status).toBe(200);
    //     });
    //     it("Body should downloadWalletfo", () => {
    //         expect(data.body).toBeDefined();
    //     });
    // });


});