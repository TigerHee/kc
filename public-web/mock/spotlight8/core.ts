import type { IMockMethod } from '@kc/mk-plugin-mock';

const releaseSchedule = [
  {
    "number": "50,000,000",
    "percentage": "5",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Airdrop"
  },
  {
    "number": "30,000,000",
    "percentage": "3",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "IEO Marketing"
  },
  {
    "number": "266,700,000",
    "percentage": "26.67",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Investors"
  },
  {
    "number": "30,000,000",
    "percentage": "3",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Market Makers"
  },
  {
    "number": "300,000,000",
    "percentage": "30",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Ecosystem"
  },
  {
    "number": "103,300,000",
    "percentage": "10.33",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Foundation"
  },
  {
    "number": "120,000,000",
    "percentage": "12",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Team"
  },
  {
    "number": "50,000,000",
    "percentage": "5",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Marketing"
  },
  {
    "number": "35,000,000",
    "percentage": "3.5",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "Reserve fund"
  },
  {
    "number": "15,000,000",
    "percentage": "1.5",
    "schedule": "Please refer to LifeForm (LFT) official website",
    "title": "IEO"
  }
]

let count = 0;

export default [
  // 活动基础信息
  {
    url: '/_api/spotlight/spotlight8/campaignInfo',
    disabled: true,
    response: () => {
      const now = Date.now();
      const anHour = 60 * 60 * 1000;
      // 时间偏移量(小时), 用于控制活动状态
      //  默认0: 未开始(预热)
      //  -3: 进行中
      //  -5: 分发中
      //  -7: 已结束
      const offset = -3;
      return {
        success: true,
        code: '200',
        data: {
          releaseSchedule,
          campaignId: '67471f75517881000112716f',
          countryCodeBlackList: 'string',
          // kcs 等级
          kcsLevel: 2,
          // 各个等级对应的折扣价格
          kcsPrices: Array.from({ length: 5 }, (_, i) => ({
            discountRate:  String(17 + i),
            discountTokenPrice: String(0.33 - i * 0.01),
          })),
          currencyList: [
            {
              campaignId: 'string',
              currency: 'USDT',
              discountRate: 0,
              id: 'usdt',
              maxInvestmentQuantity: 2000,
              minInvestmentAmount: 100,
            },
            {
              campaignId: 'string',
              currency: 'KCS',
              discountRate: 16,
              discountTokenPrice: "0.7000000000000000000000",
              id: 'KCS',
              maxInvestmentQuantity: 1000,
              minInvestmentAmount: 90,
            },
            {
              campaignId: 'string',
              currency: 'BTC',
              discountRate: 20,
              discountTokenPrice: "0.8000000000000000000000",
              id: 'BTC',
              maxInvestmentQuantity: 1000,
              minInvestmentAmount: 90,
            },
          ],
          fundraisingAmount: 1000,
          id: 'string',
          spotlight8PeriodicResponse: {
            bookStartTime: new Date(now + offset).toISOString(),
            bookEndTime: new Date(now + (offset + 2) * anHour).toISOString(),
            subStartTime: new Date(now + (offset + 2) * anHour).toISOString(),
            subEndTime: new Date(now + (offset + 4) * anHour).toISOString(),
            distributeStartTime: new Date(now + (offset + 4) * anHour).toISOString(),
            distributeEndTime: new Date(now + (offset + 6) * anHour).toISOString(),
          },
          status: 8,
          token: 'LFT',
          tokenIcon: 'string',
          tokenName: 'LifeFrom',
          tokenPrice: 12.34,
          totalSaleQuantity: 120,
          userMaxInvestmentQuantity: 10000,
        },
        msg: 'success',
        retry: true,
      };
    },
  },
  // 查询用户资格情况
  {
    url: '/_api/spotlight/spotlight8/qualification',
    // disabled: true,
    response: (_req, res) => {
      const gen = (data) => {
        return {
          success: true,
          code: '200',
          msg: 'success',
          retry: false,
          data,
        };
      }
      // ++count;
      // if (count % 3 === 1) {
      //   return gen({
      //     kycCountryAllow: true,
      //     completedKyc: true,
      //   })
      // }
      // if (count % 3 === 2) {
      //   return gen({
      //     completedKyc: true,
      //     kycCountryAllow: true,
      //     signedCountryAgreement: true,
      //   })
      // } else {
        return gen({
          kycCountryAllow: true,
          completedKyc: true,
          signedAgreement: true,
          signedCountryAgreement: true,
        })
      // }
    },
  },
  // 协议确认
  {
    url: '/_api/spotlight/spotlight8/agreement',
    // disabled: true,
    response: (_req, res) => {
      return {
        success: true,
        code: '200',
        msg: 'success',
        retry: false,
        data: false,
      };
    },
  },
  // 国家协议确认
  {
    url: '/_api/spotlight/spotlight8/countryAgreement',
    // disabled: true,
    timeout: 2000,
    response: (_req, res) => {
      return {
        success: true,
        code: '200',
        msg: 'success',
        retry: false,
        data: true,
      };
    },
  },
  // 预约活动
  {
    url: '/_api/spotlight/spotlight8/reserve/submit',
    // disabled: true,
    response: (_req, res) => {
      return {
        success: true,
        code: '200',
        msg: 'success',
        retry: false,
        data: true,
      };
    },
  },
  // 查询预约状态
  {
    url: '/_api/spotlight/spotlight8/reserve/query',
    // disabled: true,
    // timeout: 2000,
    response: (_req, res) => {
      return {
        code: 'string',
        data: false,
        msg: 'string',
        retry: true,
        success: true,
      };
    },
  },
  // 申购记录
  {
    url: '/_api/spotlight/spotlight8/subRecord',
    // disabled: true,
    response: (_req, res) => {
      return {
        code: 'string',
        data: null,
        msg: 'string',
        retry: true,
        success: true,
      };
    },
  },
  // 个人认购信息
  {
    url: '/_api/spotlight/spotlight8/invest/detail',
    // disabled: true,
    response: (_req, res) => {
      return {
        "code": "string",
        "data": {
          "currencyConfig": [
            {
              "currency": "KCS",
              "maxInvestmentQuantity": 200
            }
          ],
          "rewardAmount": 0,
          "userInvestAmount": 0,
          "userInvestCurrency": "string",
          "userRemainingInvestAmount": 100
        },
        "msg": "string",
        "retry": true,
        "success": true
      };
    },
  },
  // 统计信息
  {
    url: '/_api/spotlight/spotlight8/summary',
    disabled: true,
    response: (_req, res) => {
      return {
        "code": "string",
        "data": {
          "currencyList": [
            {
              "currency": "KCS",
              "totalAmount": 2323.0999
            }
          ],
          "sid": "string",
          "totalSubAmount": 1234,
          "totalSubscribers": null,
          // "userInvestSummary": {
          //   "userInvestAmount": 20,
          //   "userInvestCurrency": "KCS",
          //   rewardAmount: 50.25,
          // }
        },
        "msg": "string",
        "retry": true,
        "success": true
      };
    },
  },
  // 查询(get)/确认(post)申购结果信息
  {
    url: '/_api/spotlight/spotlight8/reward/confirm',
    // method: 'GET', // 指定为 GET 请求
    response: function () {
      // 确认认购奖励信息
      if (this.req.method === 'POST') {
        return {
          success: false,
          code: '200',
          msg: 'success',
          data: null,
        }
      }
      // 查询认购奖励信息
      return {
        success: true,
        msg: 'unknown error',
        code: '200',
        data: {
          // 认购退回金额（字符串格式，通常是为了保持数值精度）
          refundAmount: '100.50',
          // 奖励信息金额（数值类型）
          rewardAmount: 50.25,
          // 奖励信息是否已确认
          rewardConfirmed: false,
          // 奖励币种信息
          rewardToken: 'BTC',
          // 认购支付金额（字符串格式，通常是为了保持数值精度）
          subAmount: '1000.00',
          // 认购支付币种
          subCurrency: 'USDT',
          // 认购价格（数值类型）
          subPrice: 19999.99,
          // 认购币种logo
          tokenIcon:
            'https://assets-currency.kucoin.plus/67be8a91d6552100019c4bc5_logo%20%284%29.png',
        },
      };
    },
  },
  // 查询 金融 账户余额
  {
    url: '/_api/spotlight/spotlight8/staking/balance',
    // method: 'GET', // 指定为 GET 请求
    response: function () {
      // 查询认购奖励信息
      return {
        success: true,
        msg: 'unknown error',
        code: '200',
        data: {
          availableBalance: '20000',
        },
      };
    },
  },
] as IMockMethod[];
