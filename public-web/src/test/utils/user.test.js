/**
 * Owner: willen@kupotech.com
 */

import { getUserFlag } from 'utils/user';

describe('getUserFlag', () => {
  it('should return the first two characters of the nickname if it exists', () => {
    const user = { nickname: 'John' };
    expect(getUserFlag(user)).toBe('JO');
  });

  it('should return the first two characters of the email if the nickname does not exist', () => {
    const user = { email: 'john@example.com' };
    expect(getUserFlag(user)).toBe('JO');
  });

  it('should return the last two characters of the phone number if the nickname and email do not exist', () => {
    const user = { phone: '1234567890' };
    expect(getUserFlag(user)).toBe('90');
  });

  it('should return the first two characters of the subAccount if the user is a sub user', () => {
    const user = { isSub: true, subAccount: 'subUser' };
    expect(getUserFlag(user)).toBe('SU');
  });

  it('should return an empty string if no valid user information is provided', () => {
    const user = {};
    expect(getUserFlag(user)).toBe('');
  });

  it('should handle exceptions and return an empty string', () => {
    const user = null;
    expect(getUserFlag(user)).toBe('');
  });

  it('subAccount as falsy value', () => {
    const user = { isSub: true, subAccount: '' };
    const result = getUserFlag(user);
    expect(result).toBe('');
  });
});
