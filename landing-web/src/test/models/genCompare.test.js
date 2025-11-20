/*
 * Owner: jesse.shao@kupotech.com
 */
import { genCompare } from 'src/utils/common_models/modelHelper.js';

describe('genCompare', () => {
  test('should return a function', () => {
    const compare = genCompare('NAMESPACE/EXAMPLE_ACTION');
    expect(typeof compare).toBe('function');
  });

  test('should return true when given action matches namespace and action type', () => {
    const compare = genCompare('NAMESPACE/EXAMPLE_ACTION');
    const action = { type: 'NAMESPACE/EXAMPLE_ACTION' };
    expect(compare(action)).toBe(true);
  });

  test('should return false when given action does not match namespace and action type', () => {
    const compare = genCompare('NAMESPACE/EXAMPLE_ACTION');
    const action = { type: 'OTHER_NAMESPACE/OTHER_ACTION' };
    expect(compare(action)).toBe(false);
  });
});
