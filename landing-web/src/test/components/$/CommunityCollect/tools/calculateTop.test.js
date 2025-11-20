/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { calculateTop, getNoticeHeightValue } from 'components/$/CommunityCollect/tools/calculateTop';

describe('calculateTop', () => {
  it('calculateTop ok', () => {
    const result = calculateTop({
      enableRestrictNotice: true,
      restrictNoticeHeight: 100,
    });
    expect(result).toEqual('100px');

    const result2 = calculateTop({
      enableRestrictNotice: true,
      restrictNoticeHeight: 100,
    }, 88);
    expect(result2).toEqual('188px');

    const result3 = calculateTop({
      enableRestrictNotice: false,
      restrictNoticeHeight: 100,
    }, 88);
    expect(result3).toEqual('88px');
  });

  it('getNoticeHeightValue ok', () => {
    const result = getNoticeHeightValue(true, 40);
    expect(result).toEqual(40);

    const result2 = getNoticeHeightValue(true, 40, 0);
    expect(result2).toEqual(40);

    const result3 = getNoticeHeightValue(false, 40, 0);
    expect(result3).toEqual(0);
  });
})
