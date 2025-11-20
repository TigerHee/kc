/*
 * Owner: terry@kupotech.com
 */
import throw404 from "utils/next/throw404";

describe('throw404', () => {

  it('throw404', () => {
    try {
      throw404();
    } catch (e) {
      expect(e?.code).toBe('ENOENT')
    }
  })
})