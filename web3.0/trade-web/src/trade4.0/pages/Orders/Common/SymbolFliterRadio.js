/*
 * @Owner: Clyne@kupotech.com
 */
import { styled } from '@/style/emotion';
import Checkbox from '@mui/Checkbox';
import { useDispatch, useSelector } from 'dva';
import React, { useCallback } from 'react';
import storage from 'src/utils/storage';
import { _t } from 'utils/lang';
import { futuresPositionNameSpace } from '../FuturesOrders/config';

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  .KuxCheckbox-wrapper {
    display: flex;
    align-items: center;
    font-size: 0;
    & > span:last-of-type {
      margin-left: 3px;
      color: ${(props) => props.theme.colors.text40};
      font-size: 12px;
      line-height: 16px;
      text-align: right;
    }
    .KuxCheckbox-inner {
      width: 14px;
      height: 14px;
      border: 1px solid ${(props) => (props.active ? 'transparent' : props.theme.colors.text20)};
    }
  }
`;

const SymbolFilterRadio = ({ dataKey, namespace = futuresPositionNameSpace }) => {
  const checked = useSelector((state) => !!state[namespace][dataKey]);
  const dispatch = useDispatch();

  const onChange = useCallback(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        [dataKey]: !checked,
      },
    });
    storage.setItem(dataKey, !checked);
  }, [checked, dataKey, dispatch, namespace]);

  return (
    <CheckBoxWrapper className="tool-bar-checkbox" active={checked}>
      <Checkbox onChange={onChange} checked={checked}>
        {_t('jcJhqdVxw9W7LG9o3E2NPz')}
      </Checkbox>
    </CheckBoxWrapper>
  );
};

export default React.memo(SymbolFilterRadio);
