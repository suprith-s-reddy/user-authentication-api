// const config = require('../../config/config');
// const Promise = require('bluebird');
// const fetch = require('node-fetch');

// const verifyFbToken = (token) => {
//     return new Promise((resolve, reject) => {
//         fetch(config.fbCredentials.userDetailsUrl + token, (error, response, body) => {
//             if (!error && response && response.statusCode && response.statusCode == 200 && body) {
//                 let data = JSON.parse(body);
//                 if (!data || !data.id || !data.email) {
//                     return reject('server error ID not found');
//                 }
//                 // eslint-disable-next-line no-self-assign
//                 data.email = data.email;
//                 data.password = data.id;
//                 data.fullName = data.name;
//                 data.firstName = data.first_name;
//                 data.lastName = data.last_name;
//                 data.birthDate = data.birthday;
//                 data.fbLink = data.link;
//                 data.profilePicUrl = data.profilePicThumbUrl = data.picture && data.picture.data && data.picture.data.profilePicUrl;
//                 data.registeredFrom = 'fb';
//                 resolve(data);
//             } else {
//                 reject(error || body);
//             }
//         });
//     });
// };

// exports.verifyFbLogin = async (req, res, next) => {
//     try {
//         if (req.body.token && req.body.loginByFb) {
//             req.body = await verifyFbToken(req.body.token);
//         } else {
//             return res.status(403).send({
//                 code: 0,
//                 msg: 'Please provide valid parameters'
//             });
//         }
//     } catch (err) {
//         res.status(403).send({
//             code: 0,
//             mgs: err
//         });
//     }
// };
