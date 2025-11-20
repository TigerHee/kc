/**
 * Owner: ella@kupotech.com
 */
import { getAnchorList } from 'src/routes/Web3Wallet/config.js';

describe('test Web3Wallet getAnchorList', () => {
  test('test Web3Wallet getAnchorList', () => {
    const anchorlist = getAnchorList();
    expect(Array.isArray(anchorlist)).toBe(true);
  });
});