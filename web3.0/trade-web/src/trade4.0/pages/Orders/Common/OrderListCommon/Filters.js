/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, Fragment } from 'react';
import { map, isArray } from 'lodash';
import { useDispatch } from 'dva';
import { _t } from 'utils/lang';
import { useOrderListFilterData } from '../hooks/useOrderListInit';
import { OrderListFilters, FilterItem, DividerWrapper, ScrollComp } from './style';

const Filters = (props) => {
  const { columns, namespace } = props;
  const { hasFilter } = useOrderListFilterData({ namespace });
  const dispatch = useDispatch();

  const filters = useMemo(() => {
    if (columns && isArray(columns[0])) {
      return columns[0];
    }
  }, [columns]);

  const onReset = () => {
    const payload = {};
    map(filters, (c) => {
      if (c.key === 'status') {
        payload.cancelExist = '';
      } else {
        payload[c.key] = '';
      }
    });
    dispatch({
      type: `${namespace}/update`,
      payload: {
        page: 1,
      },
    });

    dispatch({
      type: `${namespace}/filter`,
      payload: {
        ...payload,
        triggerMethod: 'rest',
      },
    });
  };

  return (
    <ScrollComp className="bottomBorder">
      <OrderListFilters>
        {map(filters, (c, index) => {
          return (
            <React.Fragment>
              {!!index && <DividerWrapper type="vertical" />}
              <FilterItem key={`${c.key}-filter`}>{c.title}</FilterItem>
            </React.Fragment>
          );
        })}
        {hasFilter && (
          <Fragment>
            <DividerWrapper type="vertical" />
            <a onClick={onReset}>{_t('bots.reset')}</a>
          </Fragment>
        )}
      </OrderListFilters>
    </ScrollComp>
  );
};

export default Filters;
