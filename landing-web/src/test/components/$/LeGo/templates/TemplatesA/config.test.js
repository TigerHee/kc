/*
 * Owner: terry@kupotech.com
 */

import { BANNER_CONFIG, ACTIVITY_CONFIG} from 'components/$/LeGo/templates/TemplatesA/config';

jest.mock('utils/lang', () => {
  const originalModule = jest.requireActual('utils/lang');
  return {
    __esModule: true,
    ...originalModule,
    _t: () => 'test',
    _tHTML: () => 'test',
  };
})

describe('TemplatesA/config', () => {

  it('BANNER_CONFIG', () => {
    expect(BANNER_CONFIG.joinText).toBeDefined();
    expect(BANNER_CONFIG.regToast).toBeDefined();
  })

  it('ACTIVITY_CONFIG', () => {

    expect(ACTIVITY_CONFIG.time(
      1687775688086,
      1687775688086,
      'zh_CN'
    )).toBeDefined();
  })
})