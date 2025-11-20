/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-07-19 10:23:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-10-12 12:25:58
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/LayoutSetting/Recommended.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useCallback, useState } from 'react';
import {
  Module,
  ModuleName,
  RecommendedWrapper,
  RecommendedText,
  DropdownSelectWrapper,
  DropdownExtend,
  ModuleList,
} from './style';
import Switch from '@mui/Switch';
import storage from 'utils/storage.js';
import { useDispatch } from 'dva';
import { _t } from 'src/utils/lang';
import {
  RECOMMEND_BAR_POSITION_KEY,
  QUICK_ORDER_VISIBLE_KEY,
} from '@/storageKey/chart';
import useQuickOrderState from '@/components/QuickOrder/useQuickOrderState';

const { getItem, setItem } = storage;

const getOptions = () => [
  { label: _t('oLbw5sMBzMrih4JJjdj5dv'), value: 'top' },
  { label: _t('9jsbzv52Uq6fbSpPh23Fwx'), value: 'bottom' },
  { label: _t('vKizpQhWRENRuFmWCkhqjZ'), value: 'nopreview' },
];

/**
 * Recommended
 */
const Recommended = (props) => {
  const { ...restProps } = props;
  const [value, setValue] = useState(
    getItem(RECOMMEND_BAR_POSITION_KEY) || 'bottom',
  );
  const { isQuickOrderEnable } = useQuickOrderState();
  const [quickOrderVisible, setQuickOrderVisible] = useState(
    getItem(QUICK_ORDER_VISIBLE_KEY) !== false && isQuickOrderEnable,
  );
  const dispatch = useDispatch();

  const handleChange = useCallback((v) => {
    setItem(RECOMMEND_BAR_POSITION_KEY, v);
    setValue(v);
    dispatch({
      type: 'setting/update',
      payload: {
        recommendbarPosition: v,
      },
    });
  }, []);

  const updateModule = useCallback((v) => {
    setItem(QUICK_ORDER_VISIBLE_KEY, v);
    setQuickOrderVisible(v);
    dispatch({
      type: 'setting/update',
      payload: {
        quickOrderVisible: v,
      },
    });
  }, []);

  return (
    <ModuleList>
      <Module key="QuickOrder">
        <ModuleName>{_t('orders.oper.market.quick')}</ModuleName>
        <Switch disabled={!isQuickOrderEnable} onChange={updateModule} checked={quickOrderVisible} />
      </Module>
      <Module key="Recommended">
        <ModuleName>{_t('1EHsRMLxNFQtd336Ztgc8y')}</ModuleName>
        <DropdownSelectWrapper
          extendStyle={DropdownExtend}
          configs={getOptions()}
          value={value}
          onChange={handleChange}
        />
      </Module>
    </ModuleList>
  );
};

export default memo(Recommended);
