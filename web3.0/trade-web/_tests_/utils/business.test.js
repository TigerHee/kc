import { getModelSymbolInfo, getSymbolAuctionInfo } from 'src/trade4.0/utils/business.js';
import { isDisplayAuction } from 'src/trade4.0/meta/multiTenantSetting';
import { getStore } from 'src/utils/createApp';

jest.mock('src/utils/createApp', () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));
jest.mock('src/trade4.0/meta/multiTenantSetting', () => ({
  isDisplayAuction: jest.fn(() => true),
}));

describe('getSymbolAuctionInfo', () => {
  it('returns the correct symbol auction info', () => {
    const symbolInfo = {
      code: 'ACAT-USDT',
      symbolCode: 'ACAT-USDT',
      symbol: 'ACAT-USDT',
      baseCurrency: 'ACAT',
      quoteCurrency: 'USDT',
      type: 'COMMON',
      mark: 2,
      board: 0,
      weight: 0,
      enableTrading: true,
      display: true,
      market: 'KCS',
      markets: ['KCS'],
      disabledTip: null,
      createdAt: 1702952596000,
      isMarginEnabled: false,
      isEnableMarginTrade: false,
      isBotEnabled: false,
      context: null,
      sequence: 2562875,
      previewTime: null,
      previewRemainSecond: 0,
      previewEnableShow: false,
      tradeEnableShow: true,
      openingTime: 1702952940000,
      isAuctionEnabled: false,
      isEnableAuctionTrade: false,
      feeCode: 'USDT',
      makerFeeRate: '0.001',
      takerFeeRate: '0.001',
      quoteIncrement: '0.0001',
      quoteMinSize: '0.1',
      quoteMaxSize: '999',
      baseIncrement: '0.0001',
      baseMinSize: '0.1',
      baseMaxSize: '999',
      priceIncrement: '0.0001',
      priceLimitRate: '0.1',
      precision: 4,
      restrictedCountry: null,
      makerFeeCoefficient: '1.000000',
      takerFeeCoefficient: '1.000000',
      priceProtect: false,
      onlySupportLimit: null,
      limitExpireTime: null,
      referPriceUp: null,
      referPriceDown: null,
      referPriceExpireTime: null,
      minFunds: null,
      tradeSideLimit: false,
      auctionStatus: 0,
      callAuctionPrice: null,
      auctionPreviewTime: null,
      auctionPreviewRemainSecond: 0,
      unionUpdatedAt: null,
      basePrecision: 4,
      pricePrecision: 4,
      quotePrecision: 4,
      baseName: 'ACAT',
      quoteName: 'USDT',
      tickSize: 1,
      indexPriceTickSize: 1,
    };

    const auctionWhiteAllowList = [];
    const auctionWhiteAllowStatusMap = {};
    const res = getSymbolAuctionInfo(symbolInfo, auctionWhiteAllowList, auctionWhiteAllowStatusMap);
    const returnValue = {
      showAuction: false,
      isAuctionEnabled: false,
      allowAuctionTrade: false,
      previewTime: null,
      previewRemainSecond: 0,
      previewEnableShow: false,
    };
    expect(res).toEqual(returnValue);
  });
});

describe('getSymbolAuctionInfo', () => {
  it('returns the correct symbol auction info', () => {
    const symbolInfo = {
      code: 'ACAT-USDT',
      symbolCode: 'ACAT-USDT',
      symbol: 'ACAT-USDT',
      baseCurrency: 'ACAT',
      quoteCurrency: 'USDT',
      type: 'COMMON',
      mark: 2,
      board: 0,
      weight: 0,
      enableTrading: true,
      display: true,
      market: 'KCS',
      markets: ['KCS'],
      disabledTip: null,
      createdAt: 1702952596000,
      isMarginEnabled: false,
      isEnableMarginTrade: false,
      isBotEnabled: false,
      context: null,
      sequence: 2562875,
      previewTime: null,
      previewRemainSecond: 0,
      previewEnableShow: false,
      tradeEnableShow: true,
      openingTime: 1702952940000,
      isAuctionEnabled: true,
      isEnableAuctionTrade: true,
      feeCode: 'USDT',
      makerFeeRate: '0.001',
      takerFeeRate: '0.001',
      quoteIncrement: '0.0001',
      quoteMinSize: '0.1',
      quoteMaxSize: '999',
      baseIncrement: '0.0001',
      baseMinSize: '0.1',
      baseMaxSize: '999',
      priceIncrement: '0.0001',
      priceLimitRate: '0.1',
      precision: 4,
      restrictedCountry: null,
      makerFeeCoefficient: '1.000000',
      takerFeeCoefficient: '1.000000',
      priceProtect: false,
      onlySupportLimit: null,
      limitExpireTime: null,
      referPriceUp: null,
      referPriceDown: null,
      referPriceExpireTime: null,
      minFunds: null,
      tradeSideLimit: false,
      auctionStatus: 0,
      callAuctionPrice: null,
      auctionPreviewTime: null,
      auctionPreviewRemainSecond: 0,
      unionUpdatedAt: null,
      basePrecision: 4,
      pricePrecision: 4,
      quotePrecision: 4,
      baseName: 'ACAT',
      quoteName: 'USDT',
      tickSize: 1,
      indexPriceTickSize: 1,
    };

    const auctionWhiteAllowList = ['ACAT-USDT'];
    const auctionWhiteAllowStatusMap = { 'ACAT-USDT': true };

    const res = getSymbolAuctionInfo(symbolInfo, auctionWhiteAllowList, auctionWhiteAllowStatusMap);
    const returnValue = {
      showAuction: true,
      isAuctionEnabled: true,
      allowAuctionTrade: true,
      previewTime: null,
      previewRemainSecond: 0,
      previewEnableShow: false,
    };
    expect(res).toEqual(returnValue);
  });
});

describe('getSymbolAuctionInfo', () => {
  it('returns the invail symbol auction info', () => {
    const symbolInfo = {
      code: 'ACAT-USDT',
      symbolCode: 'ACAT-USDT',
      symbol: 'ACAT-USDT',
      baseCurrency: 'ACAT',
      quoteCurrency: 'USDT',
      type: 'COMMON',
      mark: 2,
      board: 0,
      weight: 0,
      enableTrading: true,
      display: true,
      market: 'KCS',
      markets: ['KCS'],
      disabledTip: null,
      createdAt: 1702952596000,
      isMarginEnabled: false,
      isEnableMarginTrade: false,
      isBotEnabled: false,
      context: null,
      sequence: 2562875,
      previewTime: null,
      previewRemainSecond: 0,
      previewEnableShow: false,
      tradeEnableShow: true,
      openingTime: 1702952940000,
      isAuctionEnabled: true,
      isEnableAuctionTrade: true,
      feeCode: 'USDT',
      makerFeeRate: '0.001',
      takerFeeRate: '0.001',
      quoteIncrement: '0.0001',
      quoteMinSize: '0.1',
      quoteMaxSize: '999',
      baseIncrement: '0.0001',
      baseMinSize: '0.1',
      baseMaxSize: '999',
      priceIncrement: '0.0001',
      priceLimitRate: '0.1',
      precision: 4,
      restrictedCountry: null,
      makerFeeCoefficient: '1.000000',
      takerFeeCoefficient: '1.000000',
      priceProtect: false,
      onlySupportLimit: null,
      limitExpireTime: null,
      referPriceUp: null,
      referPriceDown: null,
      referPriceExpireTime: null,
      minFunds: null,
      tradeSideLimit: false,
      auctionStatus: 0,
      callAuctionPrice: null,
      auctionPreviewTime: null,
      auctionPreviewRemainSecond: 0,
      unionUpdatedAt: null,
      basePrecision: 4,
      pricePrecision: 4,
      quotePrecision: 4,
      baseName: 'ACAT',
      quoteName: 'USDT',
      tickSize: 1,
      indexPriceTickSize: 1,
    };

    const auctionWhiteAllowList = ['ACAT-USDT'];
    const auctionWhiteAllowStatusMap = { 'ACAT-USDT': false };

    const res = getSymbolAuctionInfo(symbolInfo, auctionWhiteAllowList, auctionWhiteAllowStatusMap);
    const returnValue = {
      showAuction: false,
      isAuctionEnabled: false,
      allowAuctionTrade: false,
      previewTime: null,
      previewRemainSecond: 0,
      previewEnableShow: false,
    };
    expect(res).toEqual(returnValue);
  });
});

describe('getModelSymbolInfo', () => {
  it('returns the correct symbol', () => {
    const symbolInfo = {
      symbols: {
        symbolsMap: {
          'ACAT-USDT': {
            code: 'ACAT-USDT',
            symbolCode: 'ACAT-USDT',
            symbol: 'ACAT-USDT',
            baseCurrency: 'ACAT',
            quoteCurrency: 'USDT',
            type: 'COMMON',
            mark: 2,
            board: 0,
            weight: 0,
            enableTrading: true,
            display: true,
            market: 'KCS',
            markets: ['KCS'],
            disabledTip: null,
            createdAt: 1702952596000,
            isMarginEnabled: false,
            isEnableMarginTrade: false,
            isBotEnabled: false,
            context: null,
            sequence: 2562875,
            previewTime: null,
            previewRemainSecond: 0,
            previewEnableShow: false,
            tradeEnableShow: true,
            openingTime: 1702952940000,
            isAuctionEnabled: true,
            isEnableAuctionTrade: true,
            feeCode: 'USDT',
            makerFeeRate: '0.001',
            takerFeeRate: '0.001',
            quoteIncrement: '0.0001',
            quoteMinSize: '0.1',
            quoteMaxSize: '999',
            baseIncrement: '0.0001',
            baseMinSize: '0.1',
            baseMaxSize: '999',
            priceIncrement: '0.0001',
            priceLimitRate: '0.1',
            precision: 4,
            restrictedCountry: null,
            makerFeeCoefficient: '1.000000',
            takerFeeCoefficient: '1.000000',
            priceProtect: false,
            onlySupportLimit: null,
            limitExpireTime: null,
            referPriceUp: null,
            referPriceDown: null,
            referPriceExpireTime: null,
            minFunds: null,
            tradeSideLimit: false,
            auctionStatus: 0,
            callAuctionPrice: null,
            auctionPreviewTime: null,
            auctionPreviewRemainSecond: 0,
            unionUpdatedAt: null,
            basePrecision: 4,
            pricePrecision: 4,
            quotePrecision: 4,
            baseName: 'ACAT',
            quoteName: 'USDT',
          },
        },
      },
    };

    const state = {
      callAuction: {
        auctionWhiteAllowList: ['ACAT-USDT'],
        auctionWhiteAllowStatusMap: { 'ACAT-USDT': true },
      },
    };

    getStore().getState.mockReturnValue(state);
    isDisplayAuction.mockReturnValue(false);

    const symbol = getModelSymbolInfo(symbolInfo, 'ACAT-USDT');

    expect(symbol.code).toEqual('ACAT-USDT');
  });
});
