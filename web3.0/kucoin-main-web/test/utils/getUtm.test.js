/**
 * Owner: mike@kupotech.com
 */
import { getUtmLink } from 'src/utils/getUtm.js';

describe('getUtmLink', () => {
  it('should throw a TypeError if the argument is not a string', () => {
    expect(() => getUtmLink(123)).toThrow(TypeError);

    expect(() => getUtmLink({})).toThrow(TypeError);

    expect(() => getUtmLink([])).toThrow(TypeError);

    expect(() => getUtmLink(null)).toThrow(TypeError);

    expect(() => getUtmLink(undefined)).toThrow(TypeError);
  });

  it('should return an empty string if the argument is an empty string', () => {
    expect(getUtmLink('')).toBe('');
  });
});
