/*
 * owner: borden@kupotech.com
 */
import { Empty, Pagination, Spin, styled } from '@kux/mui';
import { partition } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import useRequest from 'src/hooks/useRequest';
import { _t } from 'src/tools/i18n';
import Item from '../Item';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    justify-content: left;
  }
`;
const EmptyWrapper = styled.div`
  height: 260px;
  text-align: center;
  padding-top: 50px;
`;
const PaginationWrap = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

// 普通平铺列表
const List = ({ dataSource, rowKey, refreshFn, guidePoints }) => {
  return (
    <Container>
      {dataSource.map((item, index) => {
        return (
          <Item
            key={rowKey ? rowKey(item) : index}
            {...item}
            refreshFn={refreshFn}
            guidePoints={guidePoints}
          />
        );
      })}
    </Container>
  );
};
// 根据条件分割的列表
const PartitionList = ({ dataSource, partitionFn, ...otherProps }) => {
  const [list1, list2] = partition(dataSource, partitionFn);
  return (
    <>
      <List dataSource={list1} {...otherProps} />
      <List dataSource={list2} {...otherProps} />
    </>
  );
};

const CommonTable = (
  { fetchFn, fetchParams, partitionFn, rowKey, guidePoints, onSuccess, requestOptions },
  ref,
) => {
  const { data, refresh, run, loading } = useRequest(
    (params) =>
      fetchFn({
        pageSize: 10,
        ...params,
      }),
    {
      onSuccess,
      manual: true,
      ...requestOptions,
    },
  );

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  useEffect(() => {
    run({
      page: 1,
      ...fetchParams,
    });
  }, [fetchParams]);

  const handleChange = useCallback(
    (e, v) => {
      run({
        page: v,
        ...fetchParams,
      });
    },
    [fetchParams],
  );

  const isSSG = navigator.userAgent.indexOf('SSG_ENV') !== -1;
  const commonProps = {
    rowKey,
    guidePoints,
    refreshFn: refresh,
    dataSource: data?.items,
  };

  return (
    <Spin
      className="tasks-common-table"
      spinning={isSSG || loading}
      size="small"
      style={{ marginBottom: 60 }}
    >
      {!isSSG && data?.items?.length ? (
        typeof partitionFn === 'function' ? (
          <PartitionList partitionFn={partitionFn} {...commonProps} />
        ) : (
          <List {...commonProps} />
        )
      ) : (
        <EmptyWrapper>
          {!loading && <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />}
        </EmptyWrapper>
      )}
      {!isSSG && data?.totalPage > 1 && (
        <PaginationWrap>
          <Pagination
            total={data.totalNum}
            onChange={handleChange}
            pageSize={data.pageSize}
            current={data.currentPage}
          />
        </PaginationWrap>
      )}
    </Spin>
  );
};

export default React.memo(forwardRef(CommonTable));
