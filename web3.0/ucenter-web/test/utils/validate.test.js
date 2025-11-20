import {
  checkRestrictedPageAuth,
  getRestrictedTipMessage,
  isRestrictedStatus,
} from 'src/utils/validate';

describe('validate test', () => {
  it('test isRestrictedStatus', () => {
    expect(isRestrictedStatus(1, true)).toBe(true);
  });

  it('test getRestrictedTipMessage', () => {
    getRestrictedTipMessage(1, 'zh_CN', true);
    getRestrictedTipMessage(1, 'zh_HK', true);
    getRestrictedTipMessage(1, 'en_US', true);
    getRestrictedTipMessage(3, 'en_US', true);
  });

  it('test checkRestrictedPageAuth', () => {
    checkRestrictedPageAuth(1, 'zh_CN', '/account/kyc', true, { warning: () => {} });
  });
});
