/**
 * Owner: tiger@kupotech.com
 */
import { G2FALinks, $loginKey } from 'src/components/Entrance/const';
import storage from 'utils/storage';

describe('test G2FALinks', () => {
  it('should have a zh_CN link', () => {
    expect(G2FALinks.zh_CN).toBe('https://support.kucoin.plus/hc/zh-cn/requests/new');
  });

  it('should have an en_US link', () => {
    expect(G2FALinks.en_US).toBe('https://support.kucoin.plus/hc/en-us/requests/new');
  });

  it('should have a default link', () => {
    expect(G2FALinks.default).toBe('https://support.kucoin.plus/hc/en-us/requests/new');
  });
});

describe('test $loginKey', () => {
  it('should export the correct login key', () => {
    expect($loginKey).toBe(storage.getItem('login_key'));
  });
});
