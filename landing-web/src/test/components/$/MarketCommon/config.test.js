/*
 * Owner: jesse.shao@kupotech.com
 */
// main.test.js
import {
  getLinkByScene,
  getNewcomeUrl,
  getSignUpUrl,
  getHomeUrl,
  useIsMobile,
  handleSignUp,
  BONUS_CONFIG,
  FOOTER_CONFIG,
} from 'src/components/$/MarketCommon/config.js';
import { render, fireEvent } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('utils/jsBridge', () => {
  return {
    __esModule: true,
    default: {
      init: jest.fn(),
      open: jest.fn(),
      isApp: () => false,
    },
  };
});

describe('MarketCommon config', () => {
  it('getLinkByScene', () => {
    expect(getLinkByScene()).toBe('');
    expect(
      getLinkByScene({
        rcode: 'rcode',
        utm_source: 'utm_source1',
        scene: 'share',
        needConvertedUrl: 'https://www.kucoin.com/land/sepa-lucky-draw?c=31&b=2',
      }),
    ).toBe(
      'https://www.kucoin.com/land/sepa-lucky-draw?c=31&b=2&utm_source=utm_source1&rcode=rcode',
    );

    expect(
      getLinkByScene({
        rcode: 'rcode',
        utm_source: 'utm_source1',
        scene: 'gotoRegister',
        needConvertedUrl: 'https://www.kucoin.com/land/sepa-lucky-draw?c=31&b=2',
      }),
    ).toBe('https://www.kucoin.com/land/sepa-lucky-draw?c=31&b=2&utm_source=utm_source1');

    expect(
      getLinkByScene({
        utmSource: {},
        needConvertedUrl: 'https://www.kucoin.com/land/sepa-lucky-draw?c=31&b=2',
      }),
    ).toBe('');
  });

  it('getNewcomeUrl', () => {
    expect(getNewcomeUrl()).toBe('');
    expect(getNewcomeUrl('123')).toBe('undefined/newcomer-guide');
    expect(getSignUpUrl()).toBe('');
    expect(getSignUpUrl('123')).toBe('undefined/ucenter/signup');
    expect(getHomeUrl()).toBe('');
    expect(getHomeUrl('123')).toBe('undefined');
  });

  test('test mediaQuery', () => {
    const { result } = renderHook(() => useIsMobile(null, false));

    expect(result.current).toBe(false);
  });

  it('should call JsBridge.open when isInApp and supportCookieLogin are true', () => {
    handleSignUp(true, true, '');
  });

  test('test BONUS_CONFIG', () => {
    expect(typeof BONUS_CONFIG.luckydrawTurkey.numInfo()).toBe('object');
    expect(typeof BONUS_CONFIG.luckydrawTurkey.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.luckydrawTurkey.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.luckydraw.numInfo()).toBe('object');
    expect(typeof BONUS_CONFIG.luckydraw.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.luckydraw.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.pakistanCampaign.numInfo()).toBe('object');
    expect(typeof BONUS_CONFIG.pakistanCampaign.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.pakistanCampaign.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.asianCarnival.numInfo()).toBe('object');
    expect(typeof BONUS_CONFIG.asianCarnival.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.asianCarnival.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.luckydrawSepa.numInfo()).toBe('string');
    expect(typeof BONUS_CONFIG.luckydrawSepa.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.luckydrawSepa.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.newCoinCarnival.numInfo()).toBe('string');
    expect(typeof BONUS_CONFIG.newCoinCarnival.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.newCoinCarnival.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.newTurkey.numInfo()).toBe('object');
    expect(typeof BONUS_CONFIG.newTurkey.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.newTurkey.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.promotion.numInfo()).toBe('string');
    expect(typeof BONUS_CONFIG.promotion.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.promotion.signUpUrl()).toBe('string');

    expect(typeof BONUS_CONFIG.lego.numInfo()).toBe('string');
    expect(typeof BONUS_CONFIG.lego.newcomerUrl()).toBe('string');
    expect(typeof BONUS_CONFIG.lego.signUpUrl()).toBe('string');
  });

  test('test FOOTER_CONFIG', () => {
    expect(typeof FOOTER_CONFIG.luckydrawTurkey.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.pakistanCampaign.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.luckydraw.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.asianCarnival.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.luckydrawSepa.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.newCoinCarnival.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.newTurkey.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.promotion.homeUrl()).toBe('string');
    expect(typeof FOOTER_CONFIG.lego.homeUrl()).toBe('string');
  });
});
