// const config = require('../../config/config');
// const { Storage } = require('@google-cloud/storage');
// const path = require('path');
// const mime = require('mime-types');
// const storage = new Storage({
//     projectId: config.storage.projectId,
//     keyFilename: path.join(__dirname, '../../config/' + config.storage.keyFileName)
// });
// const bucket = storage.bucket(config.storage.bucketName);

// function getPublicUrl(gcsName) {
//     return `https://storage.googleapis.com/${config.storage.bucketName}/${gcsName}`;
// }

// exports.uploadBase64 = (userId, image) => {
//     return new Promise((resolve, reject) => {
//         let imageUrl;
//         let imageBufferBase64 = image.replace(/^data:image\/\w+;base64,/, '');
//         let imageBuffer = Buffer.from(imageBufferBase64, 'base64');
//         let imageType = image.substring(image.indexOf('i'), image.indexOf(';'));
//         let imageExtension = mime.extension(imageType);
//         const gcsName = `users/${userId}.${imageExtension}`;
//         const file = bucket.file(gcsName);
//         const stream = file.createWriteStream({
//             metadata: {
//                 contentType: imageType
//             }
//         });
//         stream.on('error', (err) => {
//             console.log(err);
//             reject(err);
//         });
//         stream.on('finish', () => {
//             imageUrl = getPublicUrl(gcsName);
//             resolve(imageUrl);
//         });
//         stream.end(imageBuffer);
//     });
// };
