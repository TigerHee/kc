/**
 * Owner: tiger@kupotech.com
 */
import { $loginKey } from 'src/components/Entrance/const';
import storage from 'utils/storage';

describe('test $loginKey', () => {
  it('should export the correct login key', () => {
    expect($loginKey).toBe(storage.getItem('login_key'));
  });
});
