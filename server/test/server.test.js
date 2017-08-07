// const expect = require('expect');
// const request = require('request');
// const { RemoveCustomers } = require('./../controllers/customer.js');
// const { app } = require('./../server');

// //beforeEach((done) => {
//     // RemoveCustomers({}).then(() => {
//     //     done();
//     // })
// //})

// // describe('POST /customer'), () => {
// //     it('should create a new customer', (done) => {
// //         var customer = {
// //             "Email": "test123@test.com",
// //             "Password": "testpassword",
// //             "PublicKey": "TestPublicKey",
// //             "PrivateKey": "TestPublicKey"
// //         }
// //         console.log(customer);
// //         request(app)
// //             .post('/customer')
// //             .send(customer)
// //             .expect(200)
// //             .expect((res) => {
// //                 expect(res.body.text).toBe("User has been inserted successfully");
// //             })
// //             .end((err, res) => {
// //                 if (err) {
// //                     return done("dandy : " + err);
// //                 }
// //                 done();
// //                 // Todo.find().then((todos) => {
// //                 //     expect(todos.length).toBe(1);
// //                 //     expect(todos[0].text).toBe(text);
// //                 //     done();
// //                 // }).catch((e) => done(e));
// //             });
// //     })
// // }


// describe("Color Code Converter API", function () {
//     describe("http://localhost:3000/customer/ddd@centrica.com", function () {
//         var url = "localhost:3000/customer/ddd@centrica.com";
//         var customer = {
//             "Email": "test123@test.com",
//             "Password": "testpassword",
//             "PublicKey": "TestPublicKey",
//             "PrivateKey": "TestPublicKey"
//         }        
//         it("returns status 200", function (done) {
//             request(url, function (error, response, body) {
//                 console.log(response.statusCode);
//                 expect(response.statusCode).toEqual(400);
//                 done();
//             });
//         });
//     });
// });
