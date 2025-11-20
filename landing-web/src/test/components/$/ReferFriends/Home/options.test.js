/*
 * Owner: terry@kupotech.com
 */
import {
  TABS,
  MODE,
  getHomeInfoMap,
  AWARD_ID,
  getAwardsInfo,
} from 'components/$/ReferFriends/Home/options';

jest.mock('utils/lang', () => {
  const originalModule = jest.requireActual('utils/lang');
  return {
    __esModule: true,
    ...originalModule,
    _t: () => 'test',
    _tHTML: () => 'test',
  };
})

describe('ReferFriends-Options', () => {

  it('shoud defined', () => {
    expect(Object.keys(TABS).length).toBeGreaterThan(0);
    expect(Object.keys(MODE).length).toBeGreaterThan(0);
  })

  it('getHomeInfoMap', () => {
    const list = getHomeInfoMap();
    Object.keys(list).forEach(key => {
      const item = list[key];
      const titleFunc = item?.title;
      const iconFunc = item?.first?.icon;
      const iconFunc2 = item?.second?.icon;
      if (typeof titleFunc === 'function') {
        expect(titleFunc()).toBeDefined();
      } else {
        expect(titleFunc).toBeDefined();
      }
      if (typeof iconFunc === 'function') expect(iconFunc()).toBeDefined();
      if (typeof iconFunc2 === 'function') expect(iconFunc2()).toBeDefined();
    })
  })

  it('AWARD_ID', () => {
    expect(Object.keys(AWARD_ID).length).toBeGreaterThan(0);
  })

  it('getAwardsInfo', () => {
    const list = getAwardsInfo();
    list?.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.url).toBeDefined();
      expect(item.label).toBeDefined();
    })
  })
});