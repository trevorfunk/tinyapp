const { assert } = require('chai');
const { getUserByEmail } = require('../functions');

const userTestDatabase = {
  "randomId1": {
    id: "randomId1",
    "email": "example1@email.com",
    password: "123"
  },
  "randomId2": {
    id: "randomId2",
    "email": "example2@email.com",
    password: "abc"
  }
};

describe('getUserByEmail', function() {
  it('should return valid email and user', function() {
    const result = getUserByEmail('example1@email.com', userTestDatabase);
    const expected = { id: "randomId1", "email": "example1@email.com", password: "123" };
    assert.equal(result.id, expected.id);
    assert.equal(result.email, expected.email);
    assert.equal(result.password, expected.password);
  });

  it('should return invalid email and user should be undefined', function() {
    const result = getUserByEmail('user@example', userTestDatabase);
    const expected = { id: "randomId1", "email": "example1@email.com", password: "123" };
    assert.equal(result, undefined);
  });
});