/**
 * Owner: ella@kupotech.com
 */
import { getAnchorList } from 'src/routes/MiningPool/config.js';

describe('test MiningPool getAnchorList', () => {
  test('test MiningPool getAnchorList', () => {
    const anchorlist = getAnchorList();
    expect(Array.isArray(anchorlist)).toBe(true);
  });
});