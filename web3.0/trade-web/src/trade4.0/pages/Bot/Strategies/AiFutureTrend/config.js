/**
 * Owner: mike@kupotech.com
 */
import { div100 } from 'Bot/helper';
import { siteCfg } from 'config';
import { tipConfig } from 'AiSpotTrend/config';

const { KUCOIN_HOST } = siteCfg;
const templateId = 13;
export { tipConfig };
// 提交数据格式
export const submitData = (options) => ({
  params: [
    {
      code: 'symbol',
      value: options.symbol,
    },
    {
      code: 'limitAsset',
      value: Number(options.limitAsset),
    },
    {
      code: 'leverage',
      value: Number(options.leverage),
    },
    {
      code: 'pullBack',
      value: options.pullBack ? div100(options.pullBack) : 0.5,
    },
    {
      code: 'stopLossPercent',
      value: options.stopLossPercent ? div100(options.stopLossPercent) : undefined,
    },
    {
      code: 'stopProfitPercent',
      value: options.stopProfitPercent ? div100(options.stopProfitPercent) : undefined,
    },
    {
      code: 'createEntrance',
      value: options.createEntrance || 'otherCreate',
    },
    {
      code: 'createWay',
      value: options.createWay,
    },
  ],
  templateId,
  couponId: options.coupon?.id,
  prizeId: options.goldCoupon?.id,
  useBaseCurrency: false,
});

// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/29994085757081`,
  zh_CN: `${KUCOIN_HOST}/support/29994085757081`,
};

export const responseAlertJump = () => window.open(`${KUCOIN_HOST}/support/20065000773913`);
