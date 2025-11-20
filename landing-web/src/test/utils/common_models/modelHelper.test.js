/*
 * Owner: terry@kupotech.com
 */
import { genCompare } from 'utils/common_models/modelHelper';

describe('genCompare', () => {

  it('should return', () => {
    expect(genCompare('test')).toBeDefined();
    expect(genCompare('test')({type: 'test'})).toBeTruthy();
  })
})
