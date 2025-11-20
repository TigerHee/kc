/*
 * Owner: terry@kupotech.com
 */

import {
  pageIdMap,
  KcSensorsLogin,
  default as initHandler,
} from 'utils/kcsensors';

describe('utils/kcsensors', () => {

  it('pageIdMap', () => {
    expect(pageIdMap).toBeDefined();
  })

  it('initHandler', () => {
    expect(initHandler()).toBeUndefined();
  })

  it('KcSensorsLogin', () => {
    expect(KcSensorsLogin()).toBeUndefined();
  })
});