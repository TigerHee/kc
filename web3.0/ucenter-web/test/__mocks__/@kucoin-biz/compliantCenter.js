/**
 * Owner: sean.shi@kupotech.com
 */
module.exports = {
  CompliantBox: jest.fn((props) => props.children),
  useCompliantShow: jest.fn(() => false),
};
