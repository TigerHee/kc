/**
 * Owner: willen@kupotech.com
 */
import { ThemeProvider as KufoxProvider } from '@kufox/mui';
import { ThemeProvider as KuxProvider } from '@kux/mui';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

global.React = React;

const initialState = {
  setting: {
    currentTheme: 'light',
  },
  loading: {
    effects: [],
  },
  user: {
    isLogin: false,
  },
  categories: {
    coinDict: {
      BTC: {
        currencyName: 'bitcoin',
      },
    },
  },
  aptp: {
    records: [],
    filter: {
      ownOrder: false,
      maxAmount: null,
      minAmount: null,
      sortFields: null,
      sortValue: null,
      side: 'sell',
      currentPage: 1,
      pageSize: 10,
    },
    totalNum: 0,
    buyOrSell: 1,
    deliveryCurrencyList: [
      {
        id: '65a5f91dc56d050007f4e16b',
        shortName: 'MANTA',
        displayLabel: 'New',
      },
      {
        id: '65705a14d1c5b80008c1932c',
        shortName: 'JWJWJJWJWJW',
        displayLabel: 'New',
      },
      {
        id: '65706ed9d1c5b80008c19bf1',
        shortName: 'INSP',
        displayLabel: 'New',
      },
      {
        id: '6571652714d2cd000735a6bb',
        shortName: 'MASTER',
        displayLabel: 'New',
      },
      {
        id: '659e31fac8b9a40007262a17',
        shortName: 'MI',
        displayLabel: 'New',
      },
      {
        id: '65d4052cb31ced7d767b9769',
        shortName: 'STRK',
        displayLabel: 'New',
      },
      {
        id: '66135099771eaf00073bd624',
        shortName: 'APT',
        displayLabel: 'New',
      },
      {
        id: '66124c575c691c000726a1b1',
        shortName: 'ENA',
        displayLabel: 'New',
      },
      {
        id: '65713badd1c5b80008c1f110',
        shortName: 'BEIJING',
        displayLabel: 'New',
      },
      {
        id: '6570343fd1c5b80008c1837d',
        shortName: 'CHENGDU',
        displayLabel: 'New',
      },
      {
        id: '661e1c36150b9200072fec26',
        shortName: 'XS',
        displayLabel: 'New',
      },
      {
        id: '660cd143fa0bda00075da66d',
        shortName: 'JEFF',
        displayLabel: 'New',
      },
      {
        id: '66112262d007df00072f3150',
        shortName: 'ORDI',
        displayLabel: 'New',
      },
      {
        id: '661cdb6e150b9200072fec05',
        shortName: 'KKK',
        displayLabel: 'New',
      },
      {
        id: '6576cd5e02b40e00079dfa89',
        shortName: 'JIBEG',
        displayLabel: 'New',
      },
      {
        id: '667bcb469349930007da8cf4',
        shortName: 'FENDEV',
        displayLabel: 'Hot',
      },
      {
        id: '6683fa3bb8c06500075c5f7e',
        shortName: 'FEN2',
        displayLabel: 'New',
      },
      {
        id: '6686455f6b45a60007512815',
        shortName: 'FEN3',
        displayLabel: 'New',
      },
      {
        id: '659d205b3a5bbc0007cbab62',
        shortName: 'XAI11',
        displayLabel: 'New',
      },
      {
        id: '6575ab1e02b40e00079d7e92',
        shortName: 'GEIGEI',
        displayLabel: 'New',
      },
      {
        id: '657307c5aa036400081a4e6a',
        shortName: 'WOC',
        displayLabel: 'New',
      },
      {
        id: '6572e32491ae7e0007ab2c1a',
        shortName: 'UTK',
        displayLabel: 'New',
      },
      {
        id: '6571ee25e0312e00078e6b51',
        shortName: 'GJJ',
        displayLabel: 'New',
      },
      {
        id: '6571ea67e0312e00078e699b',
        shortName: 'BJB',
        displayLabel: 'New',
      },
      {
        id: '6571de49e0312e00078e6432',
        shortName: 'CDC',
        displayLabel: 'New',
      },
      {
        id: '6571ce34e0312e00078e5cef',
        shortName: 'BNB',
        displayLabel: 'New',
      },
      {
        id: '656fee26d1c5b80008c1722f',
        shortName: 'ETHS',
        displayLabel: 'New',
      },
      {
        id: '652cfdd71fe414000778c0e6',
        shortName: 'TIA',
        displayLabel: 'New',
      },
    ],
    deliveryCurrencyId: '6683fa3bb8c06500075c5f7e',
    deliveryCurrency: 'FEN2',
    deliveryCurrencyInfo: {
      id: '6683fa3bb8c06500075c5f7e',
      logo: 'https://asset-v2.kucoin.net/cms/media/9vNQCduon3XqIazHX0dvWMCGcu7a4agV8wPHW5gzc.jpg',
      shortName: 'FEN2',
      fullName: 'FEN2',
      introDetail: null,
      websiteLink: '',
      descLink: 'www.xxx.com',
      tradeStartAt: 1719838973,
      tradeEndAt: 1784034173,
      offerCurrency: 'USDT',
      offerCurrencySequence: 1074,
      sizeIncrement: '1',
      priceIncrement: '1',
      minSize: '1',
      minPrice: null,
      maxPrice: null,
      buyMakerFeeRate: '1', // 买方maker费率
      buyTakerFeeRate: '1', // 买方taker费率
      sellMakerFeeRate: '1', // 卖方maker费率
      sellTakerFeeRate: '1', // 卖方taker费率
      buyMakerMaxFee: '1000', // 买方maker最大手续费
      buyTakerMaxFee: '1000', // 买方taker最大手续费
      sellMakerMaxFee: '1000', // 卖方maker最大手续费
      sellTakerMaxFee: '1000', // 卖方taker最大手续费
      minFunds: null,
      maxFunds: null,
      pledgeRate: '100',
      deliveryTime: 1814447013,
      pledgeCompensateRatio: '50',
      platformLiquidatedRate: '50',
      displayTradeEndAt: true,
      maximumSupply: null,
      displayLabel: 'New',
    },
    postOrderType: 1,
    modalInfo: {
      visible: false,
      side: 'buy',
      postOrTake: 0,
      id: -1,
    },
    myOrderRecords: [
      {
        id: '6686865cfc543000073cdc88',
        offerCurrency: 'USDT',
        deliveryCurrency: 'FEN2',
        side: 'BUY',
        price: '10',
        size: '1',
        funds: '10',
        pledgeAmount: '10.1',
        createdAt: 1720092253,
        liquidity: 'MAKER',
        displayStatus: 'MATCHED',
        tax: null,
        userShortName: 'FE',
        taxRate: null,
        breakApplyList: [
          {
            requestId: '668793c5ab4db00007dd4fa0',
            compensationRate: '0',
            opDate: 1720161221000,
            opType: 'PENDING',
            selfApply: true,
          },
          {
            requestId: '668686a6fc543000073cdcdd',
            compensationRate: '13',
            opDate: 1720154127000,
            opType: 'REJECT',
            selfApply: false,
          },
          {
            requestId: '668686a6fc543000073cdcdd',
            compensationRate: '13',
            opDate: 1720092326000,
            opType: 'PENDING',
            selfApply: false,
          },
        ],
        fee: '0.1',
        platformLiquidatedRate: '50',
      },
      {
        id: '66864c576b45a60007512cfb',
        offerCurrency: 'USDT',
        deliveryCurrency: 'FEN2',
        side: 'SELL',
        price: '10',
        size: '1',
        funds: '10',
        pledgeAmount: '10',
        createdAt: 1720077399,
        liquidity: 'TAKER',
        displayStatus: 'MATCHED',
        tax: null,
        userShortName: 'FE',
        taxRate: null,
        breakApplyList: [
          {
            requestId: '66879d7eab4db00007dd5089',
            compensationRate: '38',
            opDate: 1720163710000,
            opType: 'PENDING',
            selfApply: true,
          },
          {
            requestId: '66864c8d6b45a60007512d34',
            compensationRate: '25',
            opDate: 1720077636000,
            opType: 'REJECT',
            selfApply: false,
          },
          {
            requestId: '66864c8d6b45a60007512d34',
            compensationRate: '25',
            opDate: 1720077453000,
            opType: 'PENDING',
            selfApply: false,
          },
        ],
        fee: '0.1',
        platformLiquidatedRate: '50',
      },
      {
        id: '668647366b45a60007512967',
        offerCurrency: 'USDT',
        deliveryCurrency: 'FEN3',
        side: 'SELL',
        price: '10',
        size: '10',
        funds: '100',
        pledgeAmount: '100',
        createdAt: 1720076086,
        liquidity: 'TAKER',
        displayStatus: 'MATCHED',
        tax: null,
        userShortName: 'FE',
        taxRate: null,
        breakApplyList: [
          {
            requestId: '668652f1fc543000073cc593',
            compensationRate: '20',
            opDate: 1720084800000,
            opType: 'AGREE',
            selfApply: true,
          },
          {
            requestId: '668652f1fc543000073cc593',
            compensationRate: '20',
            opDate: 1720079089000,
            opType: 'PENDING',
            selfApply: true,
          },
        ],
        fee: '1',
        platformLiquidatedRate: '10',
      },
      {
        id: '6685f77ee5b82e00077c3523',
        offerCurrency: 'USDT',
        deliveryCurrency: 'FEN2',
        side: 'SELL',
        price: '10',
        size: '1',
        funds: '10',
        pledgeAmount: '10',
        createdAt: 1720055678,
        liquidity: 'TAKER',
        displayStatus: 'MATCHED',
        tax: null,
        userShortName: 'FE',
        taxRate: null,
        breakApplyList: [
          {
            requestId: '6685f796e5b82e00077c3542',
            compensationRate: '25',
            opDate: 1720076579000,
            opType: 'AGREE',
            selfApply: false,
          },
          {
            requestId: '6685f796e5b82e00077c3542',
            compensationRate: '25',
            opDate: 1720055702000,
            opType: 'PENDING',
            selfApply: false,
          },
        ],
        fee: '0.1',
        platformLiquidatedRate: '50',
      },
      {
        id: '6683fc14b8c06500075c5f83',
        offerCurrency: 'USDT',
        deliveryCurrency: 'FEN2',
        side: 'BUY',
        price: '10',
        size: '1',
        funds: '10',
        pledgeAmount: '10.1',
        createdAt: 1719925782,
        liquidity: 'MAKER',
        displayStatus: 'MATCHED',
        tax: null,
        userShortName: 'FE',
        taxRate: null,
        breakApplyList: [
          {
            requestId: '668407b43002165460d06e17',
            compensationRate: '20',
            opDate: 1720079120000,
            opType: 'REJECT',
            selfApply: true,
          },
          {
            requestId: '668407283002165460d06dbc',
            compensationRate: '20',
            opDate: 1720079119000,
            opType: 'REJECT',
            selfApply: true,
          },
          {
            requestId: '668407f23002165460d06e41',
            compensationRate: '20',
            opDate: 1720079119000,
            opType: 'AGREE',
            selfApply: true,
          },
          {
            requestId: '668407f23002165460d06e41',
            compensationRate: '20',
            opDate: 1719928818000,
            opType: 'PENDING',
            selfApply: true,
          },
          {
            requestId: '668407b43002165460d06e17',
            compensationRate: '20',
            opDate: 1719928757000,
            opType: 'PENDING',
            selfApply: true,
          },
          {
            requestId: '668407283002165460d06dbc',
            compensationRate: '20',
            opDate: 1719928617000,
            opType: 'PENDING',
            selfApply: true,
          },
        ],
        fee: '0.1',
        platformLiquidatedRate: '50',
      },
    ],
    myOrderFilter: {
      baseCurrency: null,
      isActive: true,
      side: null,
      displayStatus: null,
      currentPage: 1,
      pageSize: 10,
    },
    myOrderTotalNum: 5,
    myOrderActivedTotalNum: 5,
    createOrderParams: {
      price: null,
      size: null,
    },
    user: {
      availableBalance: 0,
    },
    activityStatus: 1,
    confirmInfo: {
      open: false,
      content: '',
      title: '',
      buttonText: '',
    },
    hasTransactionPasswordSet: false,
    priceInfo: {
      latestPrice: null,
      minSellPrice: null,
      maxBuyPrice: null,
      avgPrice: null,
    },
    splitInfo: {
      splitOrderEnabled: true,
      orderPrice: '1000',
      orderFunds: '1000000',
    },
    enableSplit: false,
    taxInfo: {},
    taxTips: null,
    userDealTotal: {
      buySettleVol: '0',
      buyMatchVol: '20',
      sellSettleVol: '0',
      sellMatchVol: '20',
      dealTotalVol: '20',
    },
    deliveryProgress: {
      deliveryPercent: 0,
      deliveryVol: 0,
    },
    applyCancelModalInfo: {
      visible: false,
      record: null,
    },
    reviewCancelModalInfo: {
      visible: false,
      record: null,
    },
    shareModal: '',
    shareInfo: {},
  },
  spotlight8: {
    detailInfo: {},
  },
  gempool: {},
};

const mockStore = configureStore();
let store;

export const customRender = (children, state) => {
  store = mockStore({ ...initialState, ...state });
  const res = render(
    <KuxProvider>
      <KufoxProvider>
        <Provider store={store}>{children}</Provider>
      </KufoxProvider>
    </KuxProvider>,
  );

  const rerender = (children) =>
    res.rerender(
      <KuxProvider>
        <KufoxProvider>
          <Provider store={store}>{children}</Provider>
        </KufoxProvider>
      </KuxProvider>,
    );
  return { ...res, rerender };
};
