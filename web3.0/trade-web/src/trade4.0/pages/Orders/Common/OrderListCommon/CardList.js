/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, Fragment } from 'react';
import classnames from 'classnames';
import { map, isArray } from 'lodash';
import Spin from '@mui/Spin';
import Empty from '@mui/Empty';
import { _t, _tHTML } from 'utils/lang';
import { useOrderListData } from '../hooks/useOrderListInit';
import Footer from './Footer';
import { ListWrapper, CardItem, CardRowHead, CardRowNormal } from './style';

const CardList = ({ namespace, columns, screen, link }) => {
  const { dataSource, dataLoading, totalNum } = useOrderListData({ namespace });

  const renderRow = (data, index) => {
    return (
      <CardItem key={`${data.id || data.orderId}-${index}`} screen={screen}>
        {map(columns, (column, idx) => {
          if (isArray(column)) {
            // 过滤掉搜索条件
            return null;
          }

          const { dataIndex, title, render, key } = column;
          const isMergeColumn = (key || dataIndex).indexOf('_') > -1;
          if (isMergeColumn) {
            return null;
          }

          let result = null;
          if (typeof render === 'function') {
            result = render(data[key] || data[dataIndex], data);
          } else if (dataIndex || key) {
            result = data[key] || data[dataIndex];
          }

          if (title) {
            return (
              <CardRowNormal
                key={key}
                screen={screen}
                className={classnames('', {
                  oneCloumn: screen === 'sm' || screen === 'md',
                  threeCloumn: screen === 'lg',
                  fourCloumn: screen === 'lg1',
                })}
              >
                <div className="label">{title}</div>
                <div className="value">{result}</div>
              </CardRowNormal>
            );
          }

          return <CardRowHead key={key}>{result}</CardRowHead>;
        })}
      </CardItem>
    );
  };

  const renderList = useMemo(() => {
    if (dataSource?.length) {
      return (
        <Fragment>
          {map(dataSource, renderRow)}
          <Footer totalNum={totalNum} link={link} />
        </Fragment>
      );
    }

    return <Empty />;
  }, [dataSource, columns]);

  return (
    <ListWrapper>
      <Spin spinning={dataLoading}>{renderList}</Spin>
    </ListWrapper>
  );
};
export default CardList;
