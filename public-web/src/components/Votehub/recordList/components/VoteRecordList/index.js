/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 16:44:30
 * @FilePath: /public-web/src/components/Votehub/recordList/components/VoteRecordList/index.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Empty, styled, Table } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { isBoolean, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch } from 'react-redux';
import SwipeMore from 'src/components/Votehub/components/SwipeMore';
import { useIsMobileApp } from 'src/components/Votehub/hooks';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import { EmptyWrapper, InfiniteScrollList } from '../styled';
import VoteRecordItem from './VoteRecordItem';

import {
  CoinListFullName,
  CoinListItemDesc,
  CoinListItemIcon,
  CoinListItemName,
  CoinRow,
  VoteStatus,
} from './styled';

const VoteRecordPage = styled.div`
  padding: 0 16px;
  font-size: 14px;
  .voteRecordListRow {
    height: 80px;
  }
  .voteRecordListRow td {
    font-weight: 400;
    font-size: 14px;
  }
`;

// 提名记录
const VoteRecordList = () => {
  const dispatch = useDispatch();
  const isMobileApp = useIsMobileApp();
  const { currentLang } = useLocale();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const { voteRecordList = [] } = useSelector(
    (state) => state.votehub,
    keysEquality(['voteRecordList']),
  );

  const voteRecordListLoading = useSelector(
    (state) => state.loading.effects['votehub/pullVoteRecordList'],
  );

  const {
    currentPage = 1,
    pageSize = 10,
    totalNum = 0,
    totalPage = 0,
    items = [],
  } = voteRecordList;

  const [infiniteScrollList, setInfiniteScrollList] = useState([]);
  // 是否还有下一页
  const hasMore = useMemo(
    () => !voteRecordListLoading && currentPage < totalPage,
    [voteRecordListLoading, currentPage, totalPage],
  );

  // 获取数据
  const getList = useCallback(
    (currentPage, pageSize) => {
      dispatch({
        type: 'votehub/pullVoteRecordList',
        payload: {
          currentPage,
          pageSize: pageSize || 10,
        },
      });
    },
    [dispatch],
  );

  // 获取无线数据
  const getInfiniteScrollList = useCallback(
    (currentPage) => {
      dispatch({
        type: 'votehub/pullVoteRecordList',
        payload: {
          currentPage,
          pageSize: 10,
        },
      }).then((data) => {
        setInfiniteScrollList(infiniteScrollList.concat(data?.voteRecordList?.items));
      });
    },
    [infiniteScrollList, dispatch],
  );
  useEffect(() => {
    if (isBoolean(isLogin) && isLogin) {
      if (isMobileApp) {
        getInfiniteScrollList(1);
      } else {
        getList(1);
      }
    }
  }, [isLogin, dispatch, isMobileApp]);

  // pc的表格配置
  const columns = useMemo(() => {
    return [
      {
        title: _t('aNrJGcDa4ykuW3aoysQFzj'),
        dataIndex: 'currency',
        key: 'currency',
        width: 200,
        render: (currencyCode, record) => {
          return (
            <CoinRow>
              <CoinListItemIcon logoUrl={record?.logoUrl} lazyImg={true} />
              <CoinListFullName>
                <CoinListItemName>{record?.currency}</CoinListItemName>
                {record?.project ? <CoinListItemDesc>{record.project}</CoinListItemDesc> : null}
              </CoinListFullName>
            </CoinRow>
          );
        },
      },
      {
        title: _t('oatP5S9jKAdaa44YDn5vik'),
        dataIndex: 'spendTime',
        key: 'spendTime',
        width: 200,
        render: (value, record) => {
          //const _value = value ? value : record?.signUpTime;
          //const _time = moment(_value).utcOffset(0).valueOf();
          return (
            <span>
              {dateTimeFormat({
                lang: currentLang,
                date: value,
                //options: dateTimeOptoins,
              })}
            </span>
          );
        },
      },
      {
        title: _t('sBLbdTYL22URzVTXFyCsFK'),
        dataIndex: 'spendNum',
        key: 'spendNum',
        width: 220,
        render: (value, record) => <>{value}</>,
      },
      {
        title: _t('n81K1uDwAze1kubo3WKrsQ'),
        dataIndex: 'voteResult',
        key: 'voteResult',
        width: 100,
        fixed: 'right',
        align: 'right',
        render: (voteResult, record) => {
          return <span>{VoteStatus(voteResult)}</span>;
        },
      },
    ];
  }, [currentLang]);
  let renderList = null;
  if (!isMobileApp) {
    const pagination =
      totalPage > 1
        ? {
            current: currentPage,
            pageSize: pageSize,
            total: totalNum,
            onChange(_, newPage, newPageSize) {
              getList(newPage, newPageSize);
            },
          }
        : false;
    renderList = (
      <Table
        rowClassName="voteRecordListRow"
        dataSource={items}
        columns={columns}
        loading={voteRecordListLoading}
        rowKey="id"
        bordered={true}
        pagination={pagination}
        locale={{
          emptyText: _t('678WABnThqkABxZsmacgsA'),
        }}
      />
    );
  } else {
    const voteRecordItems = (
      <InfiniteScrollList id="voteRecordList">
        <InfiniteScroll
          pageStart={1}
          initialLoad={false}
          loadMore={getInfiniteScrollList}
          hasMore={hasMore}
          useWindow={true}
        >
          {isEmpty(items) && (
            <EmptyWrapper>
              <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
            </EmptyWrapper>
          )}
          {infiniteScrollList.map((item, index) => {
            return (
              <VoteRecordItem
                totalNum={infiniteScrollList?.length}
                index={index}
                key={'VoteRecordItem' + item?.id}
                item={item}
              />
            );
          })}
          <SwipeMore
            isLoadiong={voteRecordListLoading}
            currentPage={currentPage}
            infiniteScrollList={infiniteScrollList}
            totalPage={totalPage}
          />
        </InfiniteScroll>
      </InfiniteScrollList>
    );
    renderList = voteRecordItems;
  }
  return (
    <VoteRecordPage data-inspector="inspector_votehub_record_list">{renderList}</VoteRecordPage>
  );
};
export default React.memo(VoteRecordList);
