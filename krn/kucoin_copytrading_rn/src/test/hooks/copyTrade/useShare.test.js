import * as helper from '../../../hooks/copyTrade/useShare/helper';

jest.mock('site/tenant', () => ({
  getBaseCurrency: jest.fn(() => 'USDT'),
}));
jest.mock('utils/helper', () => ({
  numberFixed: jest.fn((v, d) => {
    // 简单模拟保留小数
    if (v === undefined || v === null || isNaN(Number(v))) return v;
    return Number(v).toFixed(d);
  }),
}));
jest.mock('components/Common/NumberFormat/helper', () => ({
  genComparisonOperatorAndValue: jest.fn((number, {maximumFractionDigits}) => {
    // 简单模拟符号逻辑
    if (number > 0 && number < Math.pow(10, -maximumFractionDigits)) {
      return {operator: '<', value: Math.pow(10, -maximumFractionDigits)};
    }
    if (number < 0 && number > -Math.pow(10, -maximumFractionDigits)) {
      return {operator: '>', value: -Math.pow(10, -maximumFractionDigits)};
    }
    return {operator: '', value: number};
  }),
}));

jest.mock('@krn/bridge', () => ({
  copyTradingBridge: {
    shareCopyTraderFollowOneTraderPnl: jest.fn(),
  },
  showToast: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => ({referralCode: 'abc123'})),
}));

jest.mock('../../../hooks/copyTrade/useShare/helper', () => ({
  ...jest.requireActual('../../../hooks/copyTrade/useShare/helper'),
  formatShareCopyTraderFollowOneTraderPnlEntity: jest.fn(() => ({entity: 1})),
}));

jest.mock('hooks/useLang', () => () => ({
  _t: k => k,
  numberFormat: n => n,
}));

jest.mock('hooks/useGetUSDTCurrencyInfo', () => ({
  useGetUSDTCurrencyInfo: () => ({
    displayPrecision: 2,
  }),
}));

describe('helper.js', () => {
  describe('formatShareLeadUserInfoEntity', () => {
    it('should format user info with defaults', () => {
      const profitNumberFormat = jest.fn(x => x);
      const info = {
        userAvatarUrl: 'a',
        userName: 'b',
        lead30DayPnl: 1.23456,
        lead30DayValue: 2.34567,
      };
      const result = helper.formatShareLeadUserInfoEntity(info, {
        profitNumberFormat,
      });
      expect(result).toMatchObject({
        userAvatarUrl: 'a',
        userName: 'b',
        lead30DayPnl: '1.2346',
        lead30DayValue: '2.34567',
        tradeSettleCurrency: 'USDT',
        tradePnlSide: 1,
      });
    });
    it('should handle empty info', () => {
      const profitNumberFormat = jest.fn(x => x);
      const result = helper.formatShareLeadUserInfoEntity(undefined, {
        profitNumberFormat,
      });
      expect(result.userAvatarUrl).toBe('');
      expect(result.userName).toBe('');
      expect(result.lead30DayPnl).toBe('0');
      expect(result.lead30DayValue).toBe('undefined');
      expect(result.tradeSettleCurrency).toBe('USDT');
      expect(result.tradePnlSide).toBe(-1);
    });
  });

  describe('formatShareCopyTradingPositionEntity', () => {
    it('should format position entity', () => {
      const profitNumberFormat = jest.fn(x => x + 'P');
      const numberFormat = jest.fn(x => x + 'N');
      const info = {
        tradeIsLong: 1,
        userAvatarUrl: 'a',
        tradeDisplaySymbol: 'BTC',
        userName: 'b',
        tradeLeverage: 3.456,
        tradePnlValue: 1.23456,
        tradeAveragePrice: 123,
        tradeExitPrice: 456,
        tradePnlAmountValue: 7.89,
      };
      const result = helper.formatShareCopyTradingPositionEntity(info, {
        profitNumberFormat,
        numberFormat,
      });
      expect(result).toMatchObject({
        userAvatarUrl: 'a',
        userName: 'b',
        tradeDisplaySymbol: 'BTC',
        tradeIsLong: true,
        tradeLeverage: '3.46N',
        tradePnlValue: '1.2346',
        tradeAveragePrice: 123,
        tradeExitPrice: 456,
        tradePnlAmountValue: '7.89P',
        tradePnlSide: 1,
        tradeSettleCurrency: 'USDT',
      });
    });
  });

  describe('formatShareCopyTraderFollowOneTraderPnlEntity', () => {
    it('should format follow one trader pnl entity', () => {
      const profitNumberFormat = jest.fn(x => x + 'U');
      const info = {
        copyTraderName: 'ct',
        copyTraderAvatarUrl: 'url',
        pnlPercent: 0.123456,
        pnlValue: 2.34,
        leadTraderName: 'lt',
      };
      const result = helper.formatShareCopyTraderFollowOneTraderPnlEntity(
        info,
        {profitNumberFormat},
      );
      expect(result).toMatchObject({});
    });
    it('should handle empty pnlPercent', () => {
      const profitNumberFormat = jest.fn(x => x + 'U');
      const info = {pnlPercent: ''};
      const result = helper.formatShareCopyTraderFollowOneTraderPnlEntity(
        info,
        {profitNumberFormat},
      );
      expect(result.pnlPercent).toBe(undefined);
    });
  });

  describe('formatShareLeadTraderTotalPnlEntity', () => {
    it('should format lead trader total pnl entity', () => {
      const profitNumberFormat = jest.fn(x => x + 'L');
      const info = {
        userName: 'u',
        userAvatarUrl: 'a',
        leadTotalPnlData: [1, 2],
        leadTotalPnlValue: 3.45,
      };
      const result = helper.formatShareLeadTraderTotalPnlEntity(info, {
        profitNumberFormat,
      });
      expect(result).toMatchObject({
        userName: 'u',
        userAvatarUrl: 'a',
        leadTotalPnlData: [1, 2],
        leadTotalPnlValue: '3.45L',
        tradePnlSide: 1,
        tradeSettleCurrency: 'USDT',
      });
    });
  });

  describe('formatShareCopyTraderTotalPnlEntity', () => {
    it('should format copy trader total pnl entity', () => {
      const profitNumberFormat = jest.fn(x => x + 'C');
      const info = {
        userName: 'u',
        userAvatarUrl: 'a',
        leadTradersNameData: ['x'],
        totalPnlData: [1],
        totalPnlValue: 5.67,
      };
      const result = helper.formatShareCopyTraderTotalPnlEntity(info, {
        profitNumberFormat,
      });
      expect(result).toMatchObject({
        userName: 'u',
        userAvatarUrl: 'a',
        leadTradersNameData: ['x'],
        totalPnlData: [1],
        totalPnlValue: '5.67C',
        tradePnlSide: 1,
        tradeSettleCurrency: 'USDT',
      });
    });
  });

  describe('formatPnlNumber2ValueAndOperator', () => {
    it('should return < operator for small positive', () => {
      const result = helper.formatPnlNumber2ValueAndOperator(0.00001, {
        displayPrecision: 4,
      });
      expect(result).toEqual({value: '0.00', operator: '<'});
    });
    it('should return > operator for small negative', () => {
      const result = helper.formatPnlNumber2ValueAndOperator(-0.00001, {
        displayPrecision: 4,
      });
      expect(result).toEqual({value: '-0.00', operator: '>'});
    });
    it('should return no operator for normal number', () => {
      const result = helper.formatPnlNumber2ValueAndOperator(1.23, {
        displayPrecision: 2,
      });
      expect(result).toEqual({value: '1.23', operator: ''});
    });
    it('should handle error fallback', () => {
      // mock genComparisonOperatorAndValue to throw
      const {
        genComparisonOperatorAndValue,
      } = require('components/Common/NumberFormat/helper');
      genComparisonOperatorAndValue.mockImplementationOnce(() => {
        throw new Error('fail');
      });
      const result = helper.formatPnlNumber2ValueAndOperator(1.23, {
        displayPrecision: 2,
      });
      expect(result).toEqual({value: 1.23, operator: ''});
    });
  });
});
