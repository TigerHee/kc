/**
 * Owner: willen@kupotech.com
 */

import tinyVip1 from 'static/vip/activity/tinyVip1.png';
import tinyVip10 from 'static/vip/activity/tinyVip10.png';
import tinyVip11 from 'static/vip/activity/tinyVip11.png';
import tinyVip12 from 'static/vip/activity/tinyVip12.png';
import tinyVip2 from 'static/vip/activity/tinyVip2.png';
import tinyVip3 from 'static/vip/activity/tinyVip3.png';
import tinyVip4 from 'static/vip/activity/tinyVip4.png';
import tinyVip5 from 'static/vip/activity/tinyVip5.png';
import tinyVip6 from 'static/vip/activity/tinyVip6.png';
import tinyVip7 from 'static/vip/activity/tinyVip7.png';
import tinyVip8 from 'static/vip/activity/tinyVip8.png';
import tinyVip9 from 'static/vip/activity/tinyVip9.png';
import vip1 from 'static/vip/activity/vip1.png';
import vip10 from 'static/vip/activity/vip10.png';
import vip11 from 'static/vip/activity/vip11.png';
import vip12 from 'static/vip/activity/vip12.png';
import vip2 from 'static/vip/activity/vip2.png';
import vip3 from 'static/vip/activity/vip3.png';
import vip4 from 'static/vip/activity/vip4.png';
import vip5 from 'static/vip/activity/vip5.png';
import vip6 from 'static/vip/activity/vip6.png';
import vip7 from 'static/vip/activity/vip7.png';
import vip8 from 'static/vip/activity/vip8.png';
import vip9 from 'static/vip/activity/vip9.png';

// 等级配置信息（现货合约共用）
export const VIP_LEVEL_DATA = [
  {
    // 等级
    level: 0,
    // KCS持有量（KCS）
    minHoldKCS: 0,
    // 账户资产量（USDT）
    minBalance: 0,
    // 币币交易量（USDT）
    minSpot: 0,
    // 合约交易量（USDT）
    minFutures: 0,
    // 24小时提现额度（USDT）
    limit: 1000000,
  },
  {
    level: 1,
    minHoldKCS: 1000,
    minBalance: 100000,
    minSpot: 1000000,
    minFutures: 5000000,
    limit: 3000000,
  },
  {
    level: 2,
    minHoldKCS: 10000,
    minBalance: 200000,
    minSpot: 3000000,
    minFutures: 8000000,
    limit: 3000000,
  },
  {
    level: 3,
    minHoldKCS: 20000,
    minSpot: 6000000,
    minFutures: 16000000,
    minBalance: 400000,
    limit: 5000000,
  },
  {
    level: 4,
    minHoldKCS: 30000,
    minSpot: 18000000,
    minFutures: 40000000,
    minBalance: 600000,
    limit: 5000000,
  },
  {
    level: 5,
    minHoldKCS: 40000,
    minSpot: 55000000,
    minFutures: 60000000,
    minBalance: 800000,
    limit: 10000000,
  },
  {
    level: 6,
    minHoldKCS: 50000,
    minSpot: 100000000,
    minFutures: 120000000,
    minBalance: 1000000,
    limit: 10000000,
  },
  {
    level: 7,
    minHoldKCS: 60000,
    minSpot: 180000000,
    minFutures: 200000000,
    minBalance: 2000000,
    limit: 15000000,
  },
  {
    level: 8,
    minHoldKCS: 70000,
    minSpot: 250000000,
    minFutures: 300000000,
    minBalance: 4000000,
    limit: 15000000,
  },
  {
    level: 9,
    minHoldKCS: 80000,
    minSpot: 350000000,
    minFutures: 400000000,
    minBalance: 6000000,
    limit: 30000000,
  },
  {
    level: 10,
    minHoldKCS: 90000,
    minSpot: 550000000,
    minFutures: 600000000,
    minBalance: 8000000,
    limit: 40000000,
  },
  {
    level: 11,
    minHoldKCS: 100000,
    minSpot: 750000000,
    minFutures: 800000000,
    minBalance: 10000000,
    limit: 50000000,
  },
  {
    level: 12,
    minHoldKCS: 150000,
    minSpot: 950000000,
    minFutures: 1000000000,
    minBalance: 15000000,
    limit: 60000000,
  },
];

export const VIP_CONFIG = [
  { imgsrc: vip1, tinySrc: tinyVip1 },
  { imgsrc: vip1, tinySrc: tinyVip1 },
  { imgsrc: vip2, tinySrc: tinyVip2 },
  { imgsrc: vip3, tinySrc: tinyVip3 },
  { imgsrc: vip4, tinySrc: tinyVip4 },
  { imgsrc: vip5, tinySrc: tinyVip5 },
  { imgsrc: vip6, tinySrc: tinyVip6 },
  { imgsrc: vip7, tinySrc: tinyVip7 },
  { imgsrc: vip8, tinySrc: tinyVip8 },
  { imgsrc: vip9, tinySrc: tinyVip9 },
  { imgsrc: vip10, tinySrc: tinyVip10 },
  { imgsrc: vip11, tinySrc: tinyVip11 },
  { imgsrc: vip12, tinySrc: tinyVip12 },
];
