const mongoose = require('mongoose');
const request = require('supertest');
const sinon = require('sinon');
const nock = require('nock');
const expect = require('chai').expect;
const config = require('../../config/config');
const Util = require('../../common/util');
const statusCodes = require('../../common/constants/statusCodes');
const { User } = require('../mock-data');
const { UserService } = require('../../services/mongo');
const usersURL = '/users';

describe('POST /users/register', () => {
  let server;
  let db;

  before(async () => {
    console.log('----------------------- Start -----------------------');
    server = require('../../bin/www');
    db = await mongoose.createConnection(config.db.master, config.db.options);

    nock(config.mailerService).post('').times(100).reply(statusCodes.OK, {});
  });

  beforeEach(() => {
    return db.dropDatabase();
  });

  after(() => {
    console.log('----------------------- End -----------------------');
    return db.close();
  });

  it('responds with 200 { searchHistoryId == null }', async () => {
    const response = await request(server)
      .post(`${usersURL}/register`)
      .send(User.newUser);

    // Assert status code 200
    expect(response).to.have.property('status', statusCodes.OK);

    // Assert that all three todos are included
    expect(response.body).to.have.property('data');

    const user = response.body.data;
    expect(user).to.have.property('id').that.is.a('string');
  });

  it('responds with 400 { registered user }', async () => {
    const addCompanyStub = sinon
      .stub(CompanyService, 'create')
      .returns(Promise.resolve(null));
    const response = await request(server)
      .post(`${usersURL}/register`)
      .send(User.newUser);

    // Assert status code 400
    expect(response).to.have.property('status', statusCodes.BAD_REQUEST);
    addCompanyStub.restore();
  });

  it('responds with 400 { REGISTRATION_FIELDS_INVALID_OR_MISSING }', async () => {
    const response = await request(server)
      .post(`${usersURL}/register`)
      .send({});

    // Assert status code 400
    expect(response).to.have.property('status', statusCodes.BAD_REQUEST);
  });

  it('responds with 400 { user already exists }', async () => {
    const getUserByEmailStub = sinon
      .stub(UserService, 'getUserByEmail')
      .returns(Promise.resolve(User.newUser));
    const response = await request(server)
      .post(`${usersURL}/register`)
      .send(User.newUser);

    // Assert status code 400
    expect(response).to.have.property('status', statusCodes.BAD_REQUEST);
    getUserByEmailStub.restore();
  });

  it('responds with 500 { registered user }', async () => {
    const createStub = sinon.stub(UserService, 'create').throws();

    const response = await request(server)
      .post(`${usersURL}/register`)
      .send(User.newUser);

    // Assert status code 500
    expect(response).to.have.property(
      'status',
      statusCodes.INTERNAL_SERVER_ERROR
    );
    createStub.restore();
  });

  it('responds with 500 { validateRegistrationRequest }', async () => {
    const validateEmailStub = sinon.stub(Util, 'validateEmail').throws();

    const response = await request(server)
      .post(`${usersURL}/register`)
      .send(User.newUser);

    // Assert status code 500
    expect(response).to.have.property(
      'status',
      statusCodes.INTERNAL_SERVER_ERROR
    );
    validateEmailStub.restore();
  });
});
