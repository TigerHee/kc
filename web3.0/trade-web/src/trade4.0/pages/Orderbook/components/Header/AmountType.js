/*
 * owner: Clyne@kupotech.com
 */
import React, { memo, useCallback, useMemo, Fragment } from 'react';
import Divider from '@mui/Divider';
import Switch from '@mui/Switch';
import DropdownSelect from '@/components/DropdownSelect';
import { _t } from 'src/utils/lang';
import storage from 'src/utils/storage';
import { DropdownExtend, More, SelectOutlinedIcon, UnselectOutlinedIcon, Option } from './style';
import { MoreIcon } from './Icon';
import { useDispatch, useSelector } from 'dva';
import {
  AMOUNT_TYPE,
  CUMULATIVE_TYPE, namespace,
  ANIMATE_ENABLED_STORAGE_KEY,
  ORDER_BOOK_AMOUNT_TYPE_STORAGE_KEY,
} from '../../config';
import { commonSensors } from 'src/trade4.0/meta/sensors';

/**
 * 图标
 */
const Icon = ({ isActive }) => {
  return isActive ? <SelectOutlinedIcon size={16} /> : <UnselectOutlinedIcon size={16} />;
};

/**
 * more 图标label展示
 */
const renderLabel = () => (
  <More>
    <MoreIcon />
  </More>
);

/**
 * 买卖盘动画开关
 */
const AnimateSwitch = () => {
  const dispatch = useDispatch();
  const checked = useSelector((state) => state[namespace].isAnimateEnabled);

  const handleCheck = useCallback((isAnimateEnabled) => {
    dispatch({
      type: `${namespace}/update`,
      payload: { isAnimateEnabled },
    });
    storage.setItem(ANIMATE_ENABLED_STORAGE_KEY, isAnimateEnabled);
  }, [dispatch]);

  return (
    <Fragment>
      <Divider />
      <div className="flex flex-center pt-12">
        <span className="mr-12">{_t('bcd9uhmyubAcuNdMtMnaw5')}</span>
        <Switch size="small" checked={checked} onChange={handleCheck} />
      </div>
    </Fragment>
  );
};

/**
 * 数量计算类型
 * @returns
 */
const AmountType = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state[namespace].amountType);
  const configs = useMemo(
    () => [
      {
        value: AMOUNT_TYPE,
        label: () => {
          return (
            <Option>
              <Icon isActive={value === AMOUNT_TYPE} />
              <div>{_t('deal.amount')}</div>
            </Option>
          );
        },
      },
      {
        value: CUMULATIVE_TYPE,
        label: () => {
          return (
            <Option>
              <Icon isActive={value === CUMULATIVE_TYPE} />
              <div>{_t('trade.cumulative')}</div>
            </Option>
          );
        },
      },
    ],
    [value],
  );
  const overlayProps = {
    header: _t('trade.depth.desc'),
    footer: <AnimateSwitch />,
  };
  const onChange = (v) => {
    commonSensors.orderBook.orderBooksAmountChange.click(v);
    dispatch({
      type: `${namespace}/update`,
      payload: {
        amountType: v,
      },
    });
    // 更新缓存
    storage.setItem(ORDER_BOOK_AMOUNT_TYPE_STORAGE_KEY, v);
  };
  return (
    <DropdownSelect
      extendStyle={DropdownExtend}
      configs={configs}
      value={value}
      isShowArrow={false}
      overlayProps={overlayProps}
      renderLabel={renderLabel}
      onChange={onChange}
    />
  );
};

export default memo(AmountType);
