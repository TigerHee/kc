/**
 * Owner: sean.shi@kupotech.com
 */
const storageMap = {};
class SyncStorage {
  constructor() {
  }

  getItem = jest.fn((key) => storageMap[key] || null);

  setItem = jest.fn((key, value) => {
    storageMap[key] = value;
  });

  removeItem = jest.fn((key) => {
    delete storageMap[key];
  });
}

module.exports = SyncStorage
exports.namespace = 'kucoinv2_';
