/*
 * Owner: terry@kupotech.com
 */
import { zElanguages } from 'utils/seo/config';

describe('zElanguages', () => {
  it('should be defined', () => {
    expect(zElanguages).toBeDefined();
    expect(Object.keys(zElanguages).length).toBeGreaterThan(0);
  })
})