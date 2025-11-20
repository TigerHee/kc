import {
  ACCOUNT,
  ACCOUNT_CODE,
  ACCOUNT_MAP,
  checkIsMarginAccount,
  SUB_ACCOUNT,
} from 'src/components/KuxTransferModal/config';
import { customRender } from 'test/setup';

describe('ACCOUNT_CODE', () => {
  it('should have the correct values', () => {
    expect(ACCOUNT_CODE.MAIN).toEqual('MAIN');
  });
});

describe('ACCOUNT', () => {
  it('should have the correct keys', () => {
    ACCOUNT.forEach((account) => {
      const { label, labelComp, checkCurrencyIsSupport, autoRepayEnabledTip, negativeBalanceTip } =
        account;
      expect(account).toHaveProperty('key');
      expect(account).toHaveProperty('color');
      expect(account).toHaveProperty('label');
      expect(account).toHaveProperty('labelComp');
      expect(account).toHaveProperty('supportDirection');
      expect(account).toHaveProperty('supportFromAccounts');
      expect(account).toHaveProperty('supportToAccounts');
      expect(account).toHaveProperty('checkCurrencyIsSupport');

      customRender(label());
      customRender(labelComp());
      customRender(labelComp('zh_CN'));
      if (checkCurrencyIsSupport) {
        expect(checkCurrencyIsSupport({ currency: 'USDT' })).toBe(true);
      }
      if (autoRepayEnabledTip) {
        customRender(autoRepayEnabledTip());
      }
      if (negativeBalanceTip) {
        customRender(negativeBalanceTip());
      }
    });
  });
});

describe('ACCOUNT_MAP', () => {
  it('should map keys to accounts', () => {
    Object.keys(ACCOUNT_CODE).forEach((key) => {
      expect(ACCOUNT_MAP).toHaveProperty(key);
    });
  });
});

describe('SUB_ACCOUNT', () => {
  it('should have the correct keys', () => {
    SUB_ACCOUNT.forEach((account) => {
      const { label, checkCurrencyIsSupport, autoRepayEnabledTip, negativeBalanceTip } = account;
      expect(account).toHaveProperty('key');
      expect(account).toHaveProperty('color');
      expect(account).toHaveProperty('label');
      expect(account).toHaveProperty('supportDirection');
      expect(account).toHaveProperty('supportFromAccounts');
      expect(account).toHaveProperty('supportToAccounts');
      expect(account).toHaveProperty('checkCurrencyIsSupport');

      customRender(label());
      if (checkCurrencyIsSupport) {
        expect(checkCurrencyIsSupport({ currency: 'USDT' })).toBe(true);
      }
      if (autoRepayEnabledTip) {
        customRender(autoRepayEnabledTip());
      }
      if (negativeBalanceTip) {
        customRender(negativeBalanceTip());
      }
    });
  });
});

describe('checkIsMarginAccount', () => {
  it('checkIsMarginAccount', () => {
    expect(checkIsMarginAccount('MAIN')).toBe(false);
    expect(checkIsMarginAccount('ISOLATED')).toBe(true);
  });
});
