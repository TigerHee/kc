import {openNative} from '@krn/bridge';

import {getNativeInfo} from 'utils/helper';
import {
  gotoDepositPageByCoin,
  gotoLeadTrade,
  gotoMainCopyHome,
  gotoMainCopyPage,
  gotoMainLeadPage,
  gotoOTCPage,
  gotoSymbolKumexMarket,
  gotoTransferPageByCoin,
  openH5Link,
} from 'utils/native-router-helper';

// Mock dependencies
jest.mock('@krn/bridge', () => ({
  openNative: jest.fn(),
}));

jest.mock('utils/helper', () => ({
  getNativeInfo: jest.fn(),
}));

describe('native-router-helper.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('gotoTransferPageByCoin', () => {
    it('should open transfer page with specified coin', () => {
      gotoTransferPageByCoin('BTC');
      expect(openNative).toHaveBeenCalledWith('/account/transfer?coin=BTC');
    });

    it('should use USDT as default coin', () => {
      gotoTransferPageByCoin();
      expect(openNative).toHaveBeenCalled();
    });
  });

  describe('gotoDepositPageByCoin', () => {
    it('should open deposit page with specified coin', () => {
      gotoDepositPageByCoin('ETH');
      expect(openNative).toHaveBeenCalledWith('/account/deposit?coin=ETH');
    });

    it('should use USDT as default coin', () => {
      gotoDepositPageByCoin();
      expect(openNative).toHaveBeenCalled();
    });
  });

  describe('gotoOTCPage', () => {
    it('should open OTC page with correct parameters', () => {
      gotoOTCPage();
      expect(openNative).toHaveBeenCalled();
    });
  });

  describe('gotoLeadTrade', () => {
    it('should open lead trade page with leadUserId and symbol', () => {
      gotoLeadTrade('user123', {symbol: 'BTC-USDT'});
      expect(openNative).toHaveBeenCalledWith(
        '/kumex/trade?leadUserId=user123&symbol=BTC-USDT',
      );
    });

    it('should open lead trade page without symbol', () => {
      gotoLeadTrade('user123');
      expect(openNative).toHaveBeenCalledWith(
        '/kumex/trade?leadUserId=user123',
      );
    });
  });

  describe('gotoMainLeadPage', () => {
    it('should open main lead page', () => {
      gotoMainLeadPage();
      expect(openNative).toHaveBeenCalledWith(
        '/quotes?mainTab=copyTrading&uiStateValue=copyTradingJump.myLeading',
      );
    });
  });

  describe('gotoMainCopyPage', () => {
    it('should open main copy page', () => {
      gotoMainCopyPage();
      expect(openNative).toHaveBeenCalledWith(
        '/quotes?mainTab=copyTrading&uiStateValue=copyTradingJump.myCopy',
      );
    });
  });

  describe('gotoMainCopyHome', () => {
    it('should open main copy home page', () => {
      gotoMainCopyHome();
      expect(openNative).toHaveBeenCalledWith(
        '/quotes?mainTab=copyTrading&uiStateValue=copyTradingJump.copyHome',
      );
    });
  });

  describe('gotoSymbolKumexMarket', () => {
    it('should open symbol kumex market page', () => {
      gotoSymbolKumexMarket('BTC-USDT');
      expect(openNative).toHaveBeenCalledWith('/kumex/market?symbol=BTC-USDT');
    });
  });

  describe('openH5Link', () => {
    it('should open H5 link with correct parameters', async () => {
      getNativeInfo.mockResolvedValueOnce({webApiHost: 'example.com'});
      await openH5Link('/test?param=value');
      expect(openNative).toHaveBeenCalledWith(
        '/link?url=https%3A%2F%2Fexample.com%2Ftest%3Fparam%3Dvalue%26%26loading%3D2%26appNeedLang%3Dtrue',
      );
    });

    it('should handle URL without query parameters', async () => {
      getNativeInfo.mockResolvedValueOnce({webApiHost: 'example.com'});
      await openH5Link('/test');
      expect(openNative).toHaveBeenCalledWith(
        '/link?url=https%3A%2F%2Fexample.com%2Ftest%3F%26loading%3D2%26appNeedLang%3Dtrue',
      );
    });

    it('should handle errors from getNativeInfo', async () => {
      getNativeInfo.mockRejectedValueOnce(new Error('Network error'));
      await expect(openH5Link('/test')).rejects.toThrow('Network error');
      expect(openNative).not.toHaveBeenCalled();
    });
  });
});
