/**
 * Owner: mike@kupotech.com
 */
// 主要是修改区间会用到的函数 小组件
import React, { useState, useImperativeHandle } from 'react';
import { numberFixed } from 'Bot/helper';
import SectionRadio from 'Bot/components/Common/SectionRadio';
import clsx from 'clsx';
import { updateRange, doExtend } from 'ClassicGrid/services';
import { calcMaxGridNum } from 'ClassicGrid/util';
import _ from 'lodash';
import { MIcons } from 'Bot/components/Common/Icon';
import Tag from '@kux/mui/Tag';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Flex, Text } from 'Bot/components/Widgets';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';
import useDeepCompareEffect from 'Bot/hooks/useDeepCompareEffect';

// 价格区间状态字段配置
const rangeStateConfig = {
  INRANGE: 'inRange',
  LOWERDOWN: 'lowerDown',
  UPPERUP: 'upperUp',
};
// 价格区间actionsheet中的多语言配置
export const outOfRangeLangConfig = {
  [rangeStateConfig.LOWERDOWN]: {
    runHint: '1EdRPWyh5WhCVXjMfCH8mM',
    actionSheetTitle: 'oxJ5gzwTNDpHeZU3ZmTcQN',
    howRecommendTitle: 'tmjGfWyXjFG5b2eoDLPD2k',
    recommendChoice: '7pUjg7yAqYkXWpeSgjDk7L',
  },
  [rangeStateConfig.UPPERUP]: {
    runHint: '5SHmYZbzehGwJD6uyYJeKr',
    actionSheetTitle: 'oxJ5gzwTNDpHeZU3ZmTcQN',
    howRecommendTitle: '35nfGNswWAybtJkeUecUzp',
    recommendChoice: 'f6VBA9oiudV6PYMuiHuu5T',
  },
  [rangeStateConfig.INRANGE]: {
    runHint: '',
    actionSheetTitle: '8ssZRTavyfpiEUv6EHwMRj',
    howRecommendTitle: '16jKu65L9Ern4XGKgDuJh3',
    recommendChoice: 'h5eWdAYsJKwMkRcLWpgoub',
  },
};
// 获取价格区间状态
export const getRangeState = ({ down, up, price }) => {
  down = +down;
  up = +up;
  price = +price;
  let state = rangeStateConfig.INRANGE;
  if (price < down) {
    state = rangeStateConfig.LOWERDOWN;
  } else if (price > up) {
    state = rangeStateConfig.UPPERUP;
  }
  return state;
  // return rangeStateConfig.LOWERDOWN;
};
// 出区间提示
export const OutOfPriceRangeHint = ({ onClick, down, up, price }) => {
  // 获取现在网格在区间的状态
  const rangeState = getRangeState({ down, up, price });
  if (rangeState === rangeStateConfig.INRANGE) return null;
  return (
    <div className={`fs-12 flex vc`} onClick={onClick}>
      {_t(outOfRangeLangConfig[rangeState].runHint)}
      {/* <Icon iconId="next" /> */}
    </div>
  );
};
// 区间选择修改字段配置
export const rangeRadioConfig = {
  EXTENDPRICE: '0',
  NORMALPRICE: '1',
};
// 区间单选radio组件
export const RangeChoice = ({ onChange, rangeState }) => {
  const { recommendChoice } = outOfRangeLangConfig[rangeState];
  return (
    <SectionRadio onChange={onChange} defaultValue={rangeRadioConfig.EXTENDPRICE}>
      <div className="extend-price" value={rangeRadioConfig.EXTENDPRICE}>
        <Flex vc mb={8}>
          <MIcons.AddFilled size={16} color="primary" />
          <Text pl={6} pr={6} color="text">
            {_t('4SfvaBjJAM4Jo8PURM5u8k')}
          </Text>
          <Tag variant="contained" size="small">
            {_t('jEF7Goc3rAnaMun5q3m5zJ')}
          </Tag>
        </Flex>
        <Text color="text60">{_t(recommendChoice)}</Text>
      </div>
      <div className="normal-price" value={rangeRadioConfig.NORMALPRICE}>
        <Flex vc mb={8}>
          <MIcons.EditOutlined size={16} color="primary" />
          <Text color="text" pl={6}>{_t('3Kq6aEwxQZsqrDAShxfWp7')}</Text>
        </Flex>
        <Text color="text60">{_t('uu6jfZx3tmzXRzXvgHeYcp')}</Text>
      </div>
    </SectionRadio>
  );
};
RangeChoice.rangeRadioConfig = rangeRadioConfig;

const FillAIParamsState = {
  FILL: 0,
  CLEAR: 1,
};
const FillAIParamsConfig = {
  [FillAIParamsState.FILL]: {
    text: 'gridform2',
  },
  [FillAIParamsState.CLEAR]: {
    text: 'gridform3',
  },
};

// 填写ai参数button
export const FillAIParams = React.forwardRef(({ onSwitch, defaultValue }, ref) => {
  useImperativeHandle(
    ref,
    () => {
      return {
        reset: () => {
          setState(FillAIParamsState.FILL);
        },
      };
    },
    [],
  );
  const [state, setState] = useState(defaultValue);
  const clickJack = () => {
    if (state === FillAIParamsState.FILL) {
      setState(FillAIParamsState.CLEAR);
      onSwitch(FillAIParamsState.CLEAR);
    } else if (state === FillAIParamsState.CLEAR) {
      setState(FillAIParamsState.FILL);
      onSwitch(FillAIParamsState.FILL);
    }
  };
  const { text } = FillAIParamsConfig[state];
  return (
    <Text fs={14} onClick={clickJack} className="nowrap cursor-pointer" color="primary">
      {_t(text)}
    </Text>
  );
});
// 根据后端字段获取补投的状态
export const getMakeUpStatus = (data) => {
  let results = {};
  if (!data) {
    // 成功
    results = {
      makeupStatus: 'success',
      addAmount: 0,
      sellBaseSize: 0,
    };
  } else {
    let { addAmount, sellBaseSize } = data;
    const { isExtraMoney, isNeedAddMoney } = data;
    // 补投额度
    addAmount = Math.abs(addAmount);
    // 需要卖出的数量
    sellBaseSize = Math.abs(sellBaseSize);
    // 账户是否还有多余的钱
    if (isNeedAddMoney) {
      // 是否有多余的钱
      if (!isExtraMoney) {
        results = {
          makeupStatus: 'makeupnotok',
          addAmount,
          sellBaseSize,
        };
      } else {
        // 显示立即补投
        results = {
          makeupStatus: 'makeupok',
          addAmount,
          sellBaseSize,
        };
      }
    } else {
      // 成功
      results = {
        makeupStatus: 'success',
        addAmount: 0,
        sellBaseSize,
      };
    }
  }
  return results;
};
export const defaultNormalData = {
  makeupStatus: 'empty', // 补投状态 [empty, success, makeupnotok, makeupok]
  fetchStatus: 'none', // 接口是否将要发起 用于判断是否已经获取过数据 [none, fetching, done]
  sellBaseSize: 0, // 需要卖出的数量
  addAmount: 0, // 补投额度
  loading: false,
};

/**
 * @description: 获取扩展区间ai参数
 * @param {*} oldRange 老的区间
 * @param {*} newRange ai参数接口获得的区间
 * @param {*} rangeState 当前价格在老的区间的状态
 * @param {*} pricePrecision 价格精度
 * @return {*}
 */
export const getExtendAIParams = ({ oldRange = {}, newRange = {}, rangeState, pricePrecision }) => {
  let { down, up } = oldRange;
  let { lowerLimit, upperLimit } = newRange;
  const { gridProfitRatio } = newRange;
  down = +down;
  up = +up;
  lowerLimit = +lowerLimit;
  upperLimit = +upperLimit;
  const range = {
    min: down,
    max: up,
    placeGrid: 0,
    isSameBefore: (inputMin, inputMax) => false, // 是否和修改前一样
    extendDirection: '', // 扩展方向 [low, up, lowup]
  };
  if (!lowerLimit || !upperLimit || !gridProfitRatio) {
    return range;
  }

  // 在区间范围
  if (rangeState === rangeStateConfig.INRANGE) {
    range.min = Math.min(down, lowerLimit);
    range.max = Math.max(up, upperLimit);
    // 判断在区间内，生成的ai区间\输入框中的值是否和原来一样 正常修改区间那里使用
    range.isSameBefore = (inputMin, inputMax) => {
      return (+inputMin === down && +inputMax === up) || (range.min === down && range.max === up);
    };
    if (range.min < down) {
      range.extendDirection += 'low';
    }
    if (range.max > up) {
      range.extendDirection += 'up';
    }
  } else if (rangeState === rangeStateConfig.LOWERDOWN) {
    // 在区间下
    range.min = Math.min(down, lowerLimit);
    range.max = up;
    range.extendDirection = 'low';
  } else if (rangeState === rangeStateConfig.UPPERUP) {
    // 在区间上
    range.min = down;
    range.max = Math.max(up, upperLimit);
    range.extendDirection = 'up';
  }
  // 计算最大格子数量
  const placeGrid = calcMaxGridNum(range.max, range.min, pricePrecision, gridProfitRatio);
  range.placeGrid = +placeGrid;
  range.min = Number(numberFixed(range.min, pricePrecision));
  range.max = Number(numberFixed(range.max, pricePrecision));
  return range;
};
/**
 * @description: 正常修改区间 全屏页面 多语文案配置
 * @key extendDirection
 * @return {*}
 */
export const fullScreenLangTextConfig = {
  low: '8oMX14VA1QfcKqBc22HgoD',
  up: '8oyUpeZsKVfWxJwMveWKHw',
  lowup: '9jQ8VCdk5pnRfnW1vh7GPr',
};
// 判断展示的文案状态
const getPriceStatus = ({ min, max, lastTradedPrice, makeupStatus }) => {
  min = +min;
  max = +max;
  lastTradedPrice = +lastTradedPrice;
  let status = null;
  if (!_.isFinite(min) || !_.isFinite(max) || !_.isFinite(lastTradedPrice)) {
    return null;
  }
  if (max > 0 && min > 0 && min < max && lastTradedPrice > 0) {
    if (lastTradedPrice > min && lastTradedPrice < max) {
      status = 'inprice';
    } else if (lastTradedPrice < min || lastTradedPrice > max) {
      status = 'outprice';
    } else if (!min && !max && lastTradedPrice) {
      status = null;
    }
  }
  // 接口中的状态优先级高
  return ['makeupnotok', 'makeupok'].includes(makeupStatus) ? makeupStatus : status;
};
// 获取展示的文案状态
export const getTipForInPriceRange = ({ addAmount, makeupStatus, min, max, lastTradedPrice }) => {
  const status = getPriceStatus({ makeupStatus, min, max, lastTradedPrice });
  if (status === 'success' || !status) return null;
  return (
    <Text
      as="div"
      fs={14}
      mt={8}
      mb={8}
      color={clsx({
        primary: status === 'inprice',
        complementary: ['outprice', 'makeupok'].includes(status),
        secondary: status === 'makeupnotok',
      })}
    >
      {status === 'outprice' && _tHTML('priceoutofrange')}
      {status === 'makeupnotok' && _tHTML('priceneedmore', { num: addAmount })}
      {status === 'makeupok' && _tHTML('priceneedagree', { num: addAmount })}
    </Text>
  );
};

// 扩展区间 、正常修改区间接口不一样 包装一哈
export const doPostAPI = ({ type, min, max, taskId, placeGrid, addAmount }) => {
  const api = {
    normal: () =>
      updateRange({
        depth: Number(placeGrid) + 1,
        down: min,
        up: max,
        taskId,
        isOnlyCheck: false,
        isAddMoney: true,
      }),
    extend: () =>
      doExtend({
        taskId,
        down: min,
        up: max,
        depth: Number(placeGrid) + 1,
        addAmount: Number(addAmount),
      }),
  };
  return api[type]();
};
// 标记表单需要填写的
export const mustFillFieldType = 'updateRange';
export const preventDefault = (e) => e.preventDefault();

/**
 * @description: 把弹窗按钮事件绑定到弹窗ref上, 并且更新弹窗按钮props
 * @param {*} React
 * @param {*} onClick
 * @param {*} controlRef
 * @return {*}
 */
export const ActionButton = React.memo(({ onClick, controlRef, btnProps = {} }) => {
  useBindDialogButton(controlRef, onClick);
  useDeepCompareEffect(() => {
    controlRef.current.updateBtnProps(btnProps);
  }, [btnProps]);
  return null;
});
