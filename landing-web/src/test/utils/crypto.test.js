/*
 * Owner: terry@kupotech.com
 */

import { Encrypt, Decrypt } from 'utils/crypto';

describe('utils/crypto', () => {

  it('utils/crypto', () => {
    const txt = 'Hello, World!';
    expect(Encrypt(txt)).toBeDefined();
    expect(Decrypt(Encrypt(txt))).toEqual(txt);
  })
})