import type { IMockMethod } from '@kc/mk-plugin-mock';

export default [
  // 账户余额信息
  {
    url: '/_api/account-front/v2/query/trade-account',
    // disabled: true,
    response: (_req, res) => {
      return{
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": [
          {
              "accountType": "TRADE",
              "displayName": "",
              "accountTag": "DEFAULT",
              "currency": "KCS",
              "currencyName": "KCS",
              "iconUrl": "https://assets-currency.kucoin.com/6196181fb26db300061312bd_Logo%20color.png",
              "isDigital": true,
              "totalBalance": "1000",
              "availableBalance": "1000",
              "holdBalance": "0",
              "baseCurrency": "BTC",
              "baseCurrencyPrice": "0",
              "baseCurrencyAmount": "0",
              "transferMode": "MANUAL",
              "isTradeEnabled": true,
              "time": 1741258929604
          },
        ]
      }
    },
  },
] as IMockMethod[];
