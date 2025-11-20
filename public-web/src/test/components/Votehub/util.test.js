/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
const { skip2Login, skip2Url } = require('src/components/Votehub/util');

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('skip2Login', () => {
  it('should skip2Login in app', () => {
    isApp.mockReturnValue(true);
    const result = skip2Login();
    expect(result).toBe();
  });

  it('should skip2Login not in app', () => {
    isApp.mockReturnValue(false);
    const result = skip2Login();
    expect(result).toBe();
  });
});

describe('skip2Url', () => {
  it('should locateToUrl in app', () => {
    isApp.mockReturnValue(true);
    const result = skip2Url('/');
    expect(result).toBe();
  });

  it('should skip2Url not in app', () => {
    isApp.mockReturnValue(false);
    const result = skip2Url('/');
    expect(result).toBe();
  });
});
