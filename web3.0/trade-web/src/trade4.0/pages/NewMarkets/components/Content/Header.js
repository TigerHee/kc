/*
 * @Owner: Clyne@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import React, { useContext } from 'react';
import { LIST_TYPE, namespace, SORT_ENUM, WrapperContext, SORT_FIELD_ENUM } from '../../config';
import { findIndex } from 'lodash';
import { useTheme } from '@kux/mui';
import { SvgColumn, THWrapper } from './style';
import SvgComponent from 'src/trade4.0/components/SvgComponent';
import { _t } from 'src/utils/lang';
import { useTabType } from './hooks/useType';

const configSort = ['', SORT_ENUM.ASC, SORT_ENUM.DESC];
const mapText = {
  coinSort: 'margin.borrow.currency',
  pairSort: 'orders.col.symbol',
  lastPriceSort: 'ndESvCJPTxLC7VeCQ7LScN',
  changeSort: 'ikqJ6WH1TMFZbJYmiCBK9T',
};
const Sort = ({ name, sortField }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const value = useSelector((state) => state[namespace][name]);
  const label = _t(mapText[name]);
  const onClick = () => {
    const index = findIndex(configSort, (v) => value === v);
    // next value
    const nextValue = configSort[index + 1] || '';
    dispatch({
      type: `${namespace}/update`,
      payload: {
        // search接口排序只能支持一种，其他的还要reset
        coinSort: '',
        pairSort: '',
        lastPriceSort: '',
        changeSort: '',
        [name]: nextValue,
        sortField: nextValue === '' ? '' : sortField,
        sortType: nextValue,
        currentPage: 1,
        isNext: false,
        timestamp: Date.now(),
      },
    });
  };

  return (
    <div className={`market-sort ${name}`}>
      <THWrapper onClick={onClick}>
        <span>{label}</span>
        <SvgColumn>
          <SvgComponent
            type="sort-arrow-up"
            fileName="markets"
            width={7}
            height={6}
            color={value === SORT_ENUM.ASC ? colors.primary : 'currentColor'}
          />
          <SvgComponent
            type="sort-arrow-down"
            fileName="markets"
            width={7}
            height={6}
            color={value === SORT_ENUM.DESC ? colors.primary : 'currentColor'}
          />
        </SvgColumn>
      </THWrapper>
    </div>
  );
};

const Header = () => {
  const screen = useContext(WrapperContext);
  const { isBusiness, isSearch } = useTabType();
  const firstKey = isBusiness ? 'pairSort' : 'coinSort';

  // 搜索不显示
  if (isSearch) {
    return <></>;
  }

  // 小屏幕
  if (screen === 'sm') {
    return (
      <div className="market-header sm-style">
        <Sort name={firstKey} sortField={SORT_FIELD_ENUM.SYMBOL_CODE} />
        <div className="right-box">
          <Sort name={'lastPriceSort'} sortField={SORT_FIELD_ENUM.LAST_PRICE} />
          <div className="line">/</div>
          <Sort name={'changeSort'} sortField={SORT_FIELD_ENUM.CHANGE_RATE_24} />
        </div>
      </div>
    );
  }

  return (
    <div className="market-header normal-style">
      <Sort name={firstKey} sortField={SORT_FIELD_ENUM.SYMBOL_CODE} />
      <Sort name={'lastPriceSort'} sortField={SORT_FIELD_ENUM.LAST_PRICE} />
      <Sort name={'changeSort'} sortField={SORT_FIELD_ENUM.CHANGE_RATE_24} />
    </div>
  );
};

export default Header;
