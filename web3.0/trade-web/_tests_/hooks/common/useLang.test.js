/**
 * Owner: jessie@kupotech.com
 */
import { useSelector } from 'dva';
import { useIsRTL, isRTL } from '@/hooks/common/useLang';
import { isRTLLanguage } from 'utils/langTools';

jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

jest.mock('utils/langTools', () => ({
  isRTLLanguage: jest.fn(),
}));

describe('useLang functions', () => {
  it('test isRTL', async () => {
    isRTLLanguage.mockReturnValue(true);
    expect(isRTL()).toBe(true);
    isRTLLanguage.mockReturnValue(false);
    expect(isRTL()).toBe(false);
  });

  it('test useIsRTL', () => {
    isRTLLanguage.mockImplementation((lang) => lang === 'ar_AE');
    useSelector.mockReturnValue('ar_AE');
    expect(useIsRTL()).toBe(true);
    useSelector.mockReturnValue('en_US');
    expect(useIsRTL()).toBe(false);
  });
});
