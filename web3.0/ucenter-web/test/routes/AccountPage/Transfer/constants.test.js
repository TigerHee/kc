import {
  getAccountTypeInfo,
  getOrderTypeInfo,
  HeaderDialogEnum,
  StepEnum,
} from 'src/routes/AccountPage/Transfer/constants';
import { _t } from 'src/tools/i18n';

// Mock i18n 模块
jest.mock('src/tools/i18n', () => ({
  _t: jest.fn((key) => `translated_${key}`),
}));

describe('Enums', () => {
  test('StepEnum should have correct values', () => {
    expect(StepEnum.Blocking).toBe(1);
    expect(StepEnum.Entry).toBe(2);
    expect(StepEnum.Transfer).toBe(3);
    expect(StepEnum.Process).toBe(4);
    expect(StepEnum.Success).toBe(5);
    expect(StepEnum.Failed).toBe(6);
  });

  test('HeaderDialogEnum should have correct values', () => {
    expect(HeaderDialogEnum.Back).toBe(1);
    expect(HeaderDialogEnum.Exit).toBe(2);
  });
});

describe('getAccountTypeInfo', () => {
  const testCases = [
    ['fait_currency', 'ca733e5b04524000ac40', '3e6b274ca8304800a4f1'],
    ['p2p', '955bf45f286a4800ab32', '63beb2a007904800ac8f'],
    ['kucard', '54e71137fa4b4000a127', '3e6b274ca8304800a4f1'],
    ['kucoin_pay', '18224c9d02ba4000ac0d', 'b22079d7d9474800af0e'],
  ];

  test.each(testCases)('should return correct info for %s', (key, descKey, tipsKey) => {
    const result = getAccountTypeInfo(key);

    expect(result).toEqual({
      value: key,
      desc: `translated_${descKey}`,
      tips: `translated_${tipsKey}`,
    });

    // 验证 i18n 调用
    expect(_t).toHaveBeenCalledWith(descKey);
    expect(_t).toHaveBeenCalledWith(tipsKey);
  });

  test('should return undefined for invalid key', () => {
    expect(getAccountTypeInfo('invalid_key')).toBeUndefined();
  });
});

describe('getOrderTypeInfo', () => {
  const testCases = [
    ['otc', '76ed10ba80b14000a00d'],
    ['kucoin_pay', 'b03f3898b7284000aa5e'],
    ['third_party', '76c1e294ed0b4800a87d'],
    ['fast_buy', 'b199f59735994000a478'],
    ['grey_market', 'e2f16fae86414800a96e'],
    ['fait_currency_recharge', '1f9caa7ef2a24000a211'],
    ['fait_currency_withdraw', 'cc0ab66148274800a18a'],
    ['crypto_assets_recharge', 'd944148d6a434800a39c'],
    ['crypto_assets_withdraw', '3a37ffacd82c4800a621'],
    ['migration_subscribe', 'fc423fe6fa744000a55d'],
    ['option_position', '9498e0223e764800ae0f'],
  ];

  test.each(testCases)('should return correct info for %s', (key, descKey) => {
    const result = getOrderTypeInfo(key);

    expect(result).toEqual({
      value: key,
      desc: `translated_${descKey}`,
    });

    expect(_t).toHaveBeenCalledWith(descKey);
  });

  test('should return undefined for invalid key', () => {
    expect(getOrderTypeInfo('invalid_key')).toBeUndefined();
  });
});
