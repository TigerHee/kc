/*
 * Owner: melon@kupotech.com
 */

import bindRemoteEvents from 'utils/bindRemoteEvents';

describe('test url', () => {
  it('test bindRemoteEvents func', () => {
    expect(bindRemoteEvents).toBeDefined();
    expect(bindRemoteEvents()).toBeDefined();

  });
});
