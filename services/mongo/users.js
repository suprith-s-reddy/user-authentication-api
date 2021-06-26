const Promise = require('bluebird');
const User = require('../../models/userModel');
const config = require('../../config/config');

exports.findOneByQuery = (query, projection = { __v: 0 }) => {
  return new Promise((resolve, reject) => {
    User.findOne(query, projection)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.findByQuery = (query, data, projection = { __v: 0 }) => {
  let findQuery = query;
  let limit =
    data && data.limit
      ? parseInt(data.limit)
      : parseInt(config.defaultQueryOptions.limit);
  let page =
    data && data.page
      ? parseInt(data.page)
      : parseInt(config.defaultQueryOptions.page);
  let skip = limit * page - 1;
  const pipeline = [
    { $match: findQuery },
    { $skip: skip },
    { $limit: limit },
    { $project: projection },
  ];
  return new Promise((resolve, reject) => {
    User.aggregate(pipeline)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.addOne = (data) => {
  return new Promise((resolve, reject) => {
    let user = new User(data);
    user
      .save()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.updateOneByQuery = (query, data, projection = { __v: 0 }) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(query, data, {
      projection: projection,
      new: true,
      upsert: true,
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
