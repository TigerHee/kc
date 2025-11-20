/**
 * Owner: mike@kupotech.com
 */
import DialogRef from 'Bot/components/Common/DialogRef';
import { div100 } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';

/**
 * @description: 解释的文案的dialog
 * @param {*} key 文案标题的key
 * @return {*}
 */
export const showHintDialog = (key) => {
  const toastHintConfig = tipConfig();
  if (!key || !toastHintConfig[key]) return;
  DialogRef.info({
    title: _t(key),
    content: toastHintConfig[key].content,
    okText: _t('gridform24'),
    cancelText: null,
    maskClosable: true,
  });
};

const templateId = 7;
// 提交数据格式
export const formatSubmitData = (options) => ({
  params: [
    {
      code: 'symbol',
      value: options.symbol,
    },
    {
      code: 'buyAfterFall',
      value: div100(options.buyAfterFall),
    },
    {
      code: 'buyTimes',
      value: options.buyTimes,
    },
    {
      code: 'buyMultiple',
      value: options.buyMultiple,
    },
    {
      code: 'stopProfitPercent',
      value: div100(options.stopProfitPercent),
    },
    {
      code: 'limitAsset',
      value: Number(options.limitAsset),
    },
    {
      code: 'openUnitPrice',
      value: options.openUnitPrice,
    },
    {
      code: 'circularOpeningCondition',
      value: options.circularOpeningCondition,
    },
    {
      code: 'minPrice',
      value: options.minPrice,
    },
    {
      code: 'maxPrice',
      value: options.maxPrice,
    },
    {
      code: 'stopLossPercent',
      value: div100(options.stopLossPercent) || undefined,
    },
    {
      code: 'stopLossPrice',
      value: options.stopLossPrice || undefined,
    },
  ],
  templateId,
  couponId: options.coupon?.id,
});

// 运行卡片字段提示说明配置
export const tipConfig = () => ({
  interestProfit: {
    title: _t('soJMwxHAKzNREmaAgBB4Ki'),
    content: _t('kzrRfHuKkXe4SUsKaUrLfq'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  float: {
    title: _t('card9'),
    content: _t('futrgrid.floathint'),
    okText: _t('clsgrid.btchintcancel'),
    cancelText: _t('gridform24'),
    moreLinks: {
      'en-US': '/support/900004174466--Spot-Grid-Introduction-to-Parameters',
      'zh-CN':
        `/zh-hant/support/900004174466--%E7%B6%B2%E6%A0%BC%E
        4%BA%A4%E6%98%93-%E5%8F%83%E6%95%B8%E7%B0%A1%E4%BB%8B`,
    },
  },
  avgBuyPrice: {
    title: _t('buyavgprice'),
    content: _t('avgpricehint'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  // 本轮卖出价
  currentSellPrice: {
    title: _t('qxvFxz75XooWCpWU9VSzak'),
    content: _t('a7LeMs6927iGFyRS3NSGG9'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  // 加仓倍投倍数
  '9Soj8pxepbL1a8gov36Ykk': {
    title: _t('9Soj8pxepbL1a8gov36Ykk'),
    content: _t('9cDjg7ZG7vrU3SvpsLponr'),
    okText: _t('gridform24'),
  },
  // 首轮开仓条件
  p36PVMDHJnGYexgBmLgrvN: {
    title: _t('p36PVMDHJnGYexgBmLgrvN'),
    content: _tHTML('5weLsETFE5XLJ47Z8GiGbf'),
    okText: _t('gridform24'),
  },
  // 循环开仓条件
  rTsH2BV1bbEsPXqZxwNscA: {},
  // 开仓价格区间
  g7VQsQSvnwTQ19cKnCM1ip: {
    title: _t('g7VQsQSvnwTQ19cKnCM1ip'),
    content: _tHTML('phs73ydx17VG4QybstGt8U'),
    okText: _t('gridform24'),
  },
  // 止损
  lossstop: {
    title: _t('lossstop'),
    content: _tHTML('pbo2RM1atdtjrGqbrKVSsf'),
    okText: _t('gridform24'),
  },
  // 套利利润
  soJMwxHAKzNREmaAgBB4Ki: {
    title: _t('soJMwxHAKzNREmaAgBB4Ki'),
    content: _t('kzrRfHuKkXe4SUsKaUrLfq'),
    okText: _t('gridform24'),
  },
  // 浮动盈亏
  card9: {
    title: _t('card9'),
    content: _t('futrgrid.floathint'),
    okText: _t('gridform24'),
  },
  // 本轮卖出价
  qxvFxz75XooWCpWU9VSzak: {
    title: _t('qxvFxz75XooWCpWU9VSzak'),
    content: _t('a7LeMs6927iGFyRS3NSGG9'),
    okText: _t('gridform24'),
  },
});
