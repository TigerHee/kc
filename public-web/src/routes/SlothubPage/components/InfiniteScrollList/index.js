/*
 * owner: borden@kupotech.com
 */
import { Empty, Spin, styled } from '@kux/mui';
import { noop, uniqBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { _t } from 'src/tools/i18n';
import SwipeMore from './SwipeMore';

const Container = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-bottom: 40px;
  /* 在iOS设备上使用流畅的滚动 */
  -webkit-overflow-scrolling: touch;

  /* 中屏 大屏样式 */
  ${(props) => props.theme.breakpoints.up('sm')} {
    ::-webkit-scrollbar {
      width: 6px;
      height: 2px;
      background: transparent;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 20, 42, 0.2);
      border-radius: 8px;
    }
  }
  .loader {
    width: 100%;
    margin: 4px 0;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 1.3;
    text-align: center;
  }
`;
const EmptyWrapper = styled.div`
  height: 260px;
  text-align: center;
  padding-top: 50px;
`;

const plainArr = [];
const InfiniteScrollList = (props) => {
  const {
    style,
    rowKey,
    loading,
    className,
    items = plainArr,
    totalPage = 0,
    currentPage = 1,
    onChange = noop,
    renderItem = noop,
  } = props;
  const [dataSource, setDataSource] = useState(items);
  const listLength = dataSource.length;

  const hasMore = useMemo(
    () => !loading && currentPage < totalPage,
    [loading, currentPage, totalPage],
  );

  useEffect(() => {
    if (currentPage === 1) {
      setDataSource(items);
    } else {
      // 根据key去重
      setDataSource((pre) => (rowKey ? uniqBy([...pre, ...items], rowKey) : [...pre, ...items]));
    }
  }, [items, currentPage, rowKey]);

  return (
    <Container style={style} className={className}>
      <InfiniteScroll
        useWindow
        pageStart={1}
        hasMore={hasMore}
        initialLoad={false}
        {...(hasMore ? { loadMore: onChange } : null)}
      >
        {!listLength && (
          <Spin size="small" spinning={loading}>
            <EmptyWrapper>
              {!loading && <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />}
            </EmptyWrapper>
          </Spin>
        )}
        {dataSource.map((...rest) => renderItem(...rest))}
        {Boolean(listLength && currentPage > 0) && <SwipeMore loading={Boolean(loading)} />}
      </InfiniteScroll>
    </Container>
  );
};

export default React.memo(InfiniteScrollList);
