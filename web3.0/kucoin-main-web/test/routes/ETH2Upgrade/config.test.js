/**
 * Owner: ella@kupotech.com
 */
import { getAnchorList } from 'src/routes/ETH2Upgrade/config.js';

describe('test ETH2Upgrade getAnchorList', () => {
  test('test ETH2Upgrade getAnchorList', () => {
    const anchorlist = getAnchorList();
    expect(Array.isArray(anchorlist)).toBe(true);
  });
});