/**
 * Owner: ella@kupotech.com
 */
import { getAnchorList } from 'src/routes/CopyTrading/config.js';

describe('test CopyTrading getAnchorList', () => {
  test('test CopyTrading getAnchorList', () => {
    const anchorlist = getAnchorList();
    expect(Array.isArray(anchorlist)).toBe(true);
  });
});