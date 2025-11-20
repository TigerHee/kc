/*
 * @owner: borden@kupotech.com
 */
import { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { find } from 'lodash';
import useSensorFunc from '@/hooks/useSensorFunc';
import { useOrderTypeEnable } from '../../hooks/useOrderType';
import useOrderState from '../../hooks/useOrderState';
import { WrapperContext, ORDER_TYPES, ORDER_TYPES_MAP } from '../../config';
import { execMaybeFn } from '@/utils/tools';

// 默认限价止损
const InitialTab = 'triggerPrise';

const FOLD_KEY = 'FOLD_SELECT';

const emptyArr = [];

export default function useOrderTypeTabs() {
  const dispatch = useDispatch();
  const screen = useContext(WrapperContext);
  const realActiveTab = useSelector((state) => state.tradeForm.type);
  const { showAuction } = useOrderState();
  const sensorFunc = useSensorFunc();
  // md下可以展开杠杆的tab
  const isMd = screen === 'md';
  // 是否显示某些下单类型配置
  const enableConf = useOrderTypeEnable();
  // 可使用的下单类型
  const orderTypeList = useMemo(() => {
    // 集合竞价只显示限价单
    if (showAuction) {
      return ORDER_TYPES.filter((item) => item.value === 'customPrise');
    }
    return ORDER_TYPES.filter((item) => {
      return execMaybeFn(item?.show, enableConf) !== false;
    });
  }, [enableConf, showAuction]);

  const orderTypeKeys = useMemo(() => {
    return orderTypeList.map((item) => item.value);
  }, [orderTypeList]);

  // 选中的下单类型是否可用是否存在
  // 默认订单类型
  const [isActiveTypeNotExist, defOrderType] = useMemo(() => {
    return [
      !orderTypeKeys.includes(realActiveTab),
      orderTypeKeys.includes(InitialTab) ? InitialTab : orderTypeKeys[0],
    ];
  }, [orderTypeKeys, realActiveTab]);

  const [firstItem, secondItem, otherItems] = useMemo(() => {
    const [item1, item2, ...itemOthers] = orderTypeList;
    return [item1, item2, itemOthers];
  }, [orderTypeList]);

  const [foldAciveTab, setFoldActiveTab] = useState();
  const [activeTab, setActiveTab] = useState();
  const [foldItems, setFoldItems] = useState(emptyArr);

  useEffect(() => {
    if (isMd) {
      setFoldItems(emptyArr);
    } else {
      setFoldItems(otherItems);
    }
  }, [isMd, otherItems]);

  useEffect(() => {
    if (find(foldItems, (v) => v.value === realActiveTab)) {
      setActiveTab(FOLD_KEY);
      setFoldActiveTab(realActiveTab);
    } else {
      setActiveTab(realActiveTab);
      // 杠杆暂时不支持高级限价订单类型，这里需要判断当前 select 默认选中的value 是否支持当前交易类型，不支持就用foldItems的第一个
      if (!foldAciveTab || !find(foldItems, (v) => v.value === foldAciveTab)) {
        setFoldActiveTab(foldItems[0]?.value);
      }
    }
  }, [realActiveTab, foldItems, foldAciveTab]);

  const tabs = useMemo(() => {
    const result = [];
    if (!foldItems.length) {
      result.push(...orderTypeList);
    } else {
      result.push(firstItem, secondItem, {
        value: FOLD_KEY,
        children: foldItems,
      });
    }
    return result.filter((item) => !!item);
  }, [firstItem, foldItems, orderTypeList, secondItem]);

  const onChange = useCallback(
    (e, v) => {
      if (!ORDER_TYPES_MAP[v]) return;
      if (v === 'customPrise' || v === 'marketPrise') {
        sensorFunc(['trading', `${v}Btn`]);
      } else {
        sensorFunc(['trading', 'triggerPriseBtn'], v);
      }
      dispatch({
        type: 'tradeForm/update',
        payload: {
          type: v,
        },
      });
    },
    [dispatch, sensorFunc],
  );
  // 处理不支持当前订单类型的情况
  useEffect(() => {
    if (isActiveTypeNotExist) {
      onChange(undefined, defOrderType);
    }
  }, [onChange, isActiveTypeNotExist, defOrderType]);

  return {
    tabs,
    onChange,
    activeTab,
    foldAciveTab,
    realActiveTab,
  };
}
