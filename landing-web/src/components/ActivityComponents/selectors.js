/**
 * Owner: jesse.shao@kupotech.com
 */
import { find, isObject, isEmpty, isFunction, get } from 'lodash';
import { formatNumber } from 'helper';
import { _t, _tHTML } from 'utils/lang';
import { COMMON_COUPON_TYPES, COMMON_EX_GOLD_TYPES } from './configs';

/**
 * 获取 券奖励的文案
 * @param coupon object 券数据 默认 {}
 * @param {*} param0
 *  @param prizeClass object 样式类名 默认 {}
 *  @param needFullName bool 是否需要完整的券名字 默认 false
 *  @param needPrizeProbability bool 是否需要获取概率 默认 false
 *  @param needNum bool 是否需要展示数量 默认 false
 *  @param needFormatAmount bool 是否需要格式化Amount 默认 false
 */
export const getCouponPrizeText = (coupon = {}, rest = {}) => {
  const {
    couponType = 1, // 券类型 0.杠杆券，1.合约券,2.机器人券
    robotRewardType = 1, // 奖励类型 0.天,1.U（机器人类型)
    prizeProbability = 0, // 券的获得概率
    num = 1, // 奖励数量
    couponAmount = 0, // 金额/天
    rewardPercent = 0, //
    amount = 0, // usdt金额/体验金额度/券额度
    currency = 'USDT', // 奖励额度-币种，奖励U或者BTC时需要传币种
    numCharacter = 'X', // 数量字符
  } = coupon;
  const {
    needFullName = false,
    needPrizeProbability = false,
    needNum = false,
    needFormatAmount = true,
  } = rest;
  const amountNum = couponAmount || amount || 0;
  const isDayRobot = [0, '0'].includes(robotRewardType);
  const couponTypeObj = find(COMMON_COUPON_TYPES, item => item.couponType === couponType);
  const name = couponTypeObj && isFunction(couponTypeObj.name) ? couponTypeObj.name() : '';
  // 券的完整全名称
  let fullName =
    couponTypeObj && isFunction(couponTypeObj.fullName) ? couponTypeObj.fullName() : '';
  const couponName = needFullName ? fullName : name;
  const couponNum = needNum ? `${numCharacter} ${num}` : '';
  const couponAmountNum = needFormatAmount ? formatNumber(Number(amountNum)) : amountNum;
  let prizeCodeText = needPrizeProbability
    ? () => `${_t('taskCenter.prizeProbability', { prizeProbability })} ${couponName} ${couponAmountNum}${currency} ${couponNum}`
    : () => `${couponName} ${couponAmountNum}${currency} ${couponNum}`;
  if (isDayRobot) {
    // 如果是天数类型的机器人返利券需要额外处理 fullName
    fullName = _t('taskCenter.coupon.robot.day.fullName', {
      day: amountNum,
      percent: rewardPercent,
    });
    const prizeName = needFullName ? fullName : name;
    prizeCodeText = needPrizeProbability
      ? () => `${_t('taskCenter.prizeProbability', { prizeProbability })} ${prizeName} ${couponNum}`
      : `${prizeName} ${couponNum}`;
  }
  return prizeCodeText;
};

/**
 * @param gold object 数据 默认 {}
 * @param {*} param0
 *  @param needFormatAmount bool 是否需要格式化Amount 默认 false
 *  @param prizeClass object 样式类名 默认 {}
 */
export const formatExperienceGoldText = (gold = {}, rest = {}) => {
  let exGoldText = null;
  const { needFormatAmount = true } = rest;
  if (!isEmpty(gold) && isObject(gold)) {
    const {
      couponType = 0, // 类型 0.杠杆券，1.合约券,2.机器人券
      currency = 'USDT', // 奖励额度-币种，奖励U或者BTC时需要传币种
      amount = 0, // usdt金额/体验金额度/券额度
    } = gold;
    const goldObj = find(COMMON_EX_GOLD_TYPES, item => item.couponType === couponType);
    const goldName = get(goldObj, 'name', '');
    exGoldText = () => `${isFunction(goldName) && goldName()} ${needFormatAmount ? formatNumber(Number(amount)) : amount} ${currency}`;
  }
  return exGoldText;
};

/**
 * 格式化奖励信息
 *  @param prize 奖励信息 obj 默认是{}
 *  @param {*} param0 object 默认是{}
 *  @param prizeClass object 样式类名 默认 {}
 *  @param needFullName bool 是否需要完整的券名字 默认 false
 *  @param needPrizeProbability bool 是否需要获取概率 默认 false
 *  @param needNum bool 是否需要展示数量 默认 false
 *  @param needFormatAmount bool 是否需要格式化Amount 默认 false
 */
export const formattedPrize = (prize = {}, rest = {}) => {
  let data = {};
  if (!isEmpty(prize) && isObject(prize)) {
    const {
      amount, // usdt金额/体验金额度/券额度
      num, // 奖励数量
      currency = 'USDT', // 奖励额度-币种，奖励U或者BTC时需要传币种
      type, // 奖励类型 0 USDT 1 优惠券 2 赠金奖励 3 vip体验权
    } = prize;
    const {
      needFullName = false,
      needPrizeProbability = false,
      needNum = false,
      needFormatAmount = true,
      prizeClass = {},
    } = rest;
    let prizeText = null;
    switch (type) {
      case 0:
      case 4: {
        prizeText = () => `${amount} ${currency}`;
        break;
      }
      case 1: {
        prizeText = getCouponPrizeText(prize, {
          needFullName,
          needPrizeProbability,
          needNum,
          needFormatAmount,
          prizeClass,
        });
        break;
      }
      case 2: {
        // 体验金
        prizeText = formatExperienceGoldText(prize, {
          prizeClass,
          needFormatAmount,
        });
        break;
      }
      case 3: {
        // 体验权
        prizeText = () => _tHTML('taskCenterTwo.adTask.vip', { num });
        break;
      }
      case 5: {
        // 混合券
        prizeText = () => _t('apiKing.remark.prize1', {num1: 1000, num2: 5 });
        break;
      }
      default:
        break;
    }
    data = {
      ...prize,
      prizeText: isFunction(prizeText) ? prizeText() : '',
    };
  }
  return data;
};

/**
 * 获取 options 配置对应的key属性的value
 * @param {*} options 配置的options枚举数组 默认 []
 * @param {*} value 传递的筛选 value 值 默认 ‘’
 * @param {*} key 需要返回的 value 的 key 值 默认 ‘label’
 * return 对应的key属性的value
 */

export const getOptionValueByObjectKey = (options = [], value = '', key = 'label') => {
  const targetObject = options.find(({ value: optionValue }) => value === optionValue);
  const targetValue = isEmpty(targetObject) ? undefined : targetObject[key];
  return targetValue;
};
