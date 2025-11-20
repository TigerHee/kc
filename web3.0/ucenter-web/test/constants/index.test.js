/**
 * Owner: eli.xiang@kupotech.com
 */
import { ACCOUNT_TYPE, COMMON_FETCH_STATUS, SubAccountDisableApiKeys } from 'src/constants';

describe('test constants', () => {
  test('test account type', () => {
    const accountTypeKeys = Object.keys(ACCOUNT_TYPE);
    expect(accountTypeKeys.length).toBe(8);
    expect(accountTypeKeys.includes('SubAccount')).toBe(true);
  });

  test('test fetch status', () => {
    const accountTypeKeys = Object.keys(COMMON_FETCH_STATUS);
    expect(accountTypeKeys.length).toBe(4);
    expect(accountTypeKeys.includes('fetching')).toBe(true);
  });

  test('test SubAccountDisableApiKeys', () => {
    expect(SubAccountDisableApiKeys.includes('API_EARN')).toBe(true);
  });
});
