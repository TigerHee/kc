/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, Fragment } from 'react';
import { map, isArray } from 'lodash';
import Spin from '@mui/Spin';
import Empty from '@mui/Empty';
import { _t, _tHTML } from 'utils/lang';
import { useOrderListData } from '../hooks/useOrderListInit';
import Footer from './Footer';
import { ListWrapper, RowItem } from './style';

const List = ({ namespace, columns, rowPercentage, screen, link }) => {
  const { dataSource, dataLoading, totalNum } = useOrderListData({ namespace });

  const renderRow = (data, index) => {
    return (
      <RowItem key={`${data.id || data.orderId}-${index}`} screen={screen}>
        {map(columns, (column, i) => {
          if (isArray(column)) {
            return null;
          }
          const { dataIndex, render, key } = column;
          let result = null;
          const isMergeColumn = (key || dataIndex).indexOf('_') > -1;
          if (typeof render === 'function') {
            // 折叠的column
            if (isMergeColumn) {
              const [key1, key2] = (key || dataIndex).split('_');
              result = render(data[key1], data[key2], data);
            } else {
              result = render(data[key] || data[dataIndex], data);
            }
          } else if (dataIndex || key) {
            result = data[key] || data[dataIndex];
          }
          return (
            <div
              key={key}
              style={{
                width: `${rowPercentage[i] * 100}%`,
              }}
              className={isMergeColumn ? 'mergeColumn' : ''}
            >
              {result}
            </div>
          );
        })}
      </RowItem>
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

    const getDescription = () => {
      return <Footer totalNum={totalNum} link={link} />;
    };
    return <Empty getDescription={getDescription} />;
  }, [dataSource, renderRow, totalNum, link]);

  return (
    <ListWrapper>
      <Spin spinning={dataLoading}>{renderList}</Spin>
    </ListWrapper>
  );
};
export default List;
