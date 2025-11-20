import { siteCfg } from 'config';
import { getUtmLink, getUtm } from 'utils/getUtm';
import { cleanup } from '@testing-library/react';
import storage from 'utils/storage';

afterEach(cleanup);

// Mock the necessary modules

jest.mock('utils/storage.js', () => ({
  getItem: jest.fn(),
}));

describe('getUtmLink', () => {
  it('test get Utm', () => {
    const utmLink = getUtmLink(`${siteCfg.MAINSITE_HOST}${'/news/futures-terms-of-use-list'}`);
    expect(typeof utmLink).toBe('string');
  });

  it('throws error when url is not a string', () => {
    expect(() => getUtmLink(123)).toThrow('Expected argument to be a string.');
  });

  it('returns empty string when url is empty', () => {
    expect(getUtmLink('')).toBe('');
  });
});

describe('getUtm', () => {
  it('returns an object with utm values from storage', () => {
    storage.getItem.mockImplementation((key) => (key === 'utm_source' ? 'test_source' : undefined));

    expect(getUtm()).toEqual({ thirdPartClient: 'test_source' });
  });
});
