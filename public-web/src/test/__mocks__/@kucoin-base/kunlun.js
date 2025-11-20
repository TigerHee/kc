/**
 * Owner: jennifer.y.liu@kupotech.com
 */

const kunlun = jest.fn(() => ({
    report: jest.fn(),
    init: jest.fn(),
  }));
  
  module.exports = kunlun;