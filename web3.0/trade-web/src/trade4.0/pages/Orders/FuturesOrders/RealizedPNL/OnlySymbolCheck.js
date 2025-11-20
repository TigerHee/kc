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
import { useDispatch, useSelector } from 'dva';
import { _t } from 'utils/lang';
import { styled } from '@/style/emotion';

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

const OnlySymbolCheck = ({ style }) => {
  const dispatch = useDispatch();
  const isPnlOnlySymbolCheck = useSelector((state) => state.futures_orders.isPnlOnlySymbolCheck);
  const handleCheckboxChange = (e) => {
    // 在当前委托和高级委托 模块下，点击只看当前交易对，需要更新两个model数据
    dispatch({
      type: 'futures_orders/update',
      payload: {
        isPnlOnlySymbolCheck: e.target.checked,
      },
    });
  };
  return (
    <CheckBoxWrapper style={style} active={isPnlOnlySymbolCheck}>
      <Checkbox onChange={handleCheckboxChange} checked={isPnlOnlySymbolCheck}>
        {_t('jcJhqdVxw9W7LG9o3E2NPz')}
      </Checkbox>
    </CheckBoxWrapper>
  );
};

export default React.memo(OnlySymbolCheck);
