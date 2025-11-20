/**
 * Owner: iron@kupotech.com
 */

const storageMap = {};

const storage = {
  getItem: jest.fn(key => storageMap[key] || null),
  setItem: jest.fn((key, value) => {
    storageMap[key] = value;
  }),
  removeItem: jest.fn(key => {
    delete storageMap[key];
  }),
};

module.exports = storage;
