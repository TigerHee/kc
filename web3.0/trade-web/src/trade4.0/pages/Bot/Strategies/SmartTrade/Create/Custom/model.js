/**
 * Owner: mike@kupotech.com
 */
import React, { createContext, useContext, useRef, useEffect } from 'react';
import useStateRef from '@/hooks/common/useStateRef';
import useMergeState from 'Bot/hooks/useMergeState';
import { symbolInfo } from 'SmartTrade/config';
import { useSelector } from 'dva';
import _ from 'lodash';
import { getMatchMode } from 'SmartTrade/components/CreatePosition/AutoFill';
import { dropNull } from 'SmartTrade/util';
import { Form } from 'Bot/components/Common/CForm';

const ContextOfCreatePage = createContext(null);

const templateId = 4;
const defaultState = () => {
  return {
    createWay: 'Custom',
    coins: [], // 币种配比列表
    minInverstment: 0, // 最小投资额度

    method: { interval: '1H', autoChange: true }, // 调仓方式
    lossProfit: {
      // 止盈止损
      stopLoss: undefined,
      isSellOnStopLoss: undefined,

      stopProfit: undefined,
      isSellOnStopProfit: undefined,
    },
    fillType: 0, // 配比模式
    coupon: null, // 卡券
  };
};
// interface Coin {
//   currency: String,
//   value: Number, // 现在用户设置的比例
//   triggerPrice: Number, // 触发开单价
//   percent: Number // 曾经设置的比例
// }
export const Provider = ({ children, symbol }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};
  const [formData, setMergeState] = useMergeState(defaultState());
  // limitAsset 投资额;useOtherCoins是否使用多币种，在表单中
  // 将form表单数据和state数据合并
  const allFormData = {
    ...formData,
    ...values,
    symbol,
  };

  // 设置来自投资组合/排行榜的数据
  const inverstCompose = useSelector((state) => state.smarttrade.inverstCompose);
  useEffect(() => {
    const { targets, method, percentType, from } = inverstCompose;
    const state = {
      fillType: getMatchMode(percentType),
    };
    if (!_.isEmpty(targets)) {
      state.coins = _.cloneDeep(targets);
      state.createWay = 'AI';
    }
    if (!_.isEmpty(method)) {
      // 打开高级设置
      state.method = dropNull(method);

      const advance = document.querySelector('.high-setting-label');
      advance && advance.click();
    }
    setMergeState(state);
  }, [inverstCompose]);

  // coinRatioRef
  const coinRatioRef = useRef();

  const { base, quota, symbolCode } = symbolInfo;
  // 集合所有数据
  const allData = {
    stra: 'POSITION',
    templateId,
    symbolInfo,
    symbolCode,
    base,
    quota,
    formData: allFormData,
    form,
    // 提交成功后清空
    clear: () => {
      setMergeState(defaultState());
      form.resetFields();
    },
    // 清空卡券
    clearCoupon: () => setMergeState({ coupon: null }),
    setCoupon: (coupon) => setMergeState({ coupon }),
    coinRatioRef,
    setMergeState,
    // 设置币种信息
    setCoins: (newCoins) => {
      setMergeState({ coins: newCoins });
    },
    // 设置最小投资额
    setMinInvestment: ({ minInvestment }) => {
      setMergeState({ minInverstment: minInvestment });
    },
    // 设置配比模式
    setFillType: (fillType) => {
      setMergeState({ fillType });
    },
  };
  // 数据集合ref
  const dataRef = useStateRef(allData);

  return (
    <ContextOfCreatePage.Provider
      value={{
        dataRef,
        ...allData,
      }}
    >
      {children}
    </ContextOfCreatePage.Provider>
  );
};

export const useModel = () => {
  return useContext(ContextOfCreatePage);
};
