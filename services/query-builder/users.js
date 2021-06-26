const ObjectId = require('mongoose').Types.ObjectId;

let projection = { __v: 0 };

exports.getByIdQuery = (id) => {
  let obj = {},
    query = {
      _id: ObjectId(id),
    };
  obj.query = query;
  obj.projection = projection;

  return obj;
};

exports.getByUserNameQuery = (userName) => {
  let obj = {},
    query = {
      userName: userName,
    };
  obj.query = query;
  obj.projection = projection;

  return obj;
};

exports.getByEmailQuery = (email) => {
  let obj = {},
    query = {
      email: email.trim(),
    };
  obj.query = query;
  obj.projection = projection;

  return obj;
};

exports.getByEmailOrUserNameQuery = (email, userName) => {
  let obj = {},
    query = {
      $or: [{ email: email }, { userName: userName }],
    };
  obj.query = query;
  obj.projection = projection;

  return obj;
};

exports.getLoginQuery = (userName) => {
  let obj = {},
    query = {
      $or: [{ email: userName }, { userName: userName }],
    };
  obj.query = query;
  obj.projection = projection;
  return obj;
};
