/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 20:55:09
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-06 15:05:17
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/HideOtherPairsRadio.js
 * @Description:
 */
import React from 'react';
import Checkbox from '@mui/Checkbox';
import { useDispatch } from 'dva';
import { _t } from 'utils/lang';
import { styled } from '@/style/emotion';
import { commonSensorsFunc } from '@/meta/sensors';

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  .KuxCheckbox-wrapper {
    font-size: 0;
    display: flex;
    align-items: center;
    & > span:last-of-type {
      font-size: 12px;
      line-height: 16px;
      margin-left: 3px;
      color: ${(props) => props.theme.colors.text40};
    }
    .KuxCheckbox-inner {
      width: 14px;
      height: 14px;
      border: 1px solid ${(props) => (props.active ? 'transparent' : props.theme.colors.text20)};
    }
  }
`;

const HideOtherPairsRadio = ({
  namespace,
  active,
  isOpenAndStopOrders,
  style,
  hiddenSymbolClick,
  sensorKey,
}) => {
  const dispatch = useDispatch();
  const handleCheckboxChange = (e) => {
    // 在当前委托和高级委托和TWAP 模块下，点击只看当前交易对，需要更新3个model数据
    if (isOpenAndStopOrders) {
      dispatch({
        type: 'orderCurrent/filter',
        payload: {
          symbol: !active ? 'current' : '',
          triggerMethod: 'rest',
        },
      });

      dispatch({ type: 'orderCurrent/update', payload: { page: 1 } });

      dispatch({
        type: 'orderStop/filter',
        payload: {
          symbol: !active ? 'current' : '',
          triggerMethod: 'rest',
        },
      });
      dispatch({ type: 'orderStop/update', payload: { page: 1 } });

      dispatch({
        type: 'orderTwap/filter',
        payload: {
          symbol: !active ? 'current' : '',
          triggerMethod: 'rest',
        },
      });
      dispatch({ type: 'orderTwap/update', payload: { page: 1 } });

      commonSensorsFunc(['openOrders', 5, 'click']);
    } else {
      dispatch({
        type: `${namespace}/filter`,
        payload: {
          symbol: !active ? 'current' : '',
          triggerMethod: 'rest',
        },
      });
      dispatch({ type: `${namespace}/update`, payload: { page: 1 } });
      if (sensorKey) {
        commonSensorsFunc([sensorKey, 3, 'click']);
      }
    }

    if (hiddenSymbolClick) {
      hiddenSymbolClick();
    }
  };

  return (
    <CheckBoxWrapper style={style} active={active}>
      <Checkbox onChange={handleCheckboxChange} checked={active}>
        {_t('jcJhqdVxw9W7LG9o3E2NPz')}
      </Checkbox>
    </CheckBoxWrapper>
  );
};

export default React.memo(HideOtherPairsRadio);
