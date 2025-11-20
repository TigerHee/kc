/**
 * Owner: lori@kupotech.com
 */
import MarginSensors from 'src/components/Margin/sensors.js';

describe('test components/Margin/sensors', () => {
  test('test MarginSensors', () => {
    expect(MarginSensors()).toBe();
    expect(MarginSensors(['marginBorrowTradingArea', 'borrow'])).toBe();
  });
});
