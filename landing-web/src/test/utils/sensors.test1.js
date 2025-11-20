/**
 * Owner: terry@kupotech.com
 */
import { getSpm } from 'src/utils/sensors.js';
// Jest mock for dynamic imports


jest.mock('@kc/sensors', () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue({
      spm: 'mocked-spm-value'
    }),
  };
});

// jest.mock('@kc/sensors', () => {
//   return Promise.resolve({
//     __esModule: true, // this property makes it work as if using `export default`
//     default: {
//       spm: 'mocked-spm-value'
//     }
//   });
// }, { virtual: true });

describe('getSpm', () => {
  it('should resolve with the spm value from the dynamically imported module', () => {
    getSpm().then((spmValue) => {
      expect(spmValue).toBeDefined();
    })
  });
});