/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 15:51:51
 * @FilePath: /public-web/src/components/Votehub/recordList/components/TicketList/index.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Empty, Table } from '@kux/mui';
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
import { getTicketStatus, TicketListPage } from './styled';
import TicketItem from './TicketItem';

// 上币票获得记录
const TicketList = () => {
  const dispatch = useDispatch();
  const isMobileApp = useIsMobileApp();
  const { currentLang } = useLocale();

  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const { ticketList = [] } = useSelector((state) => state.votehub, keysEquality(['ticketList']));
  const ticketListLoading = useSelector((state) => state.loading.effects['votehub/pullTicketList']);
  const { currentPage = 1, pageSize = 10, totalNum = 0, totalPage = 0, items = [] } = ticketList;

  const [infiniteScrollList, setInfiniteScrollList] = useState([]);
  // 是否还有下一页
  const hasMore = useMemo(
    () => !ticketListLoading && currentPage < totalPage,
    [ticketListLoading, currentPage, totalPage],
  );

  // 获取数据
  const getList = useCallback(
    (currentPage, pageSize) => {
      dispatch({
        type: 'votehub/pullTicketList',
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
        type: 'votehub/pullTicketList',
        payload: {
          currentPage,
          pageSize: 10,
        },
      }).then((data) => {
        setInfiniteScrollList(infiniteScrollList.concat(data?.ticketList?.items));
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
        title: _t('9Vsfit4gjYGqyWnR1es9Ku'),
        dataIndex: 'quantity',
        key: 'quantity',
        width: 200,
        render: (quantity) => <div>{quantity}</div>,
      },
      {
        title: _t('kgJvn5PfwZgJCfdtaAnjSv'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 200,
        render: (value, record) => {
          //const _value = value ? value : record?.signUpTime;
          //const _time = moment(_value).utcOffset(0).valueOf();
          return (
            <span>
              {dateTimeFormat({
                lang: currentLang,
                date: value,
              })}
            </span>
          );
        },
      },
      {
        title: _t('ppxbXuVGLzkoafEWXh6g9d'),
        dataIndex: 'opType',
        key: 'opType',
        width: 100,
        fixed: 'right',
        align: 'right',
        render: (value, record) => {
          return getTicketStatus(value);
        },
      },
    ];
  }, [currentLang]);
  let renderList = null;
  if (!isMobileApp) {
    renderList = (
      <Table
        rowClassName="ticketListRow"
        dataSource={items}
        columns={columns}
        loading={ticketListLoading}
        bordered={true}
        locale={{
          emptyText: _t('678WABnThqkABxZsmacgsA'),
        }}
        pagination={
          totalPage > 1
            ? {
                current: currentPage,
                pageSize: pageSize,
                total: totalNum,
                onChange(_, newPage, newPageSize) {
                  console.log(newPage, 'newPage123');
                  getList(newPage);
                },
              }
            : false
        }
      />
    );
  } else {
    const ticketListItems = (
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
              <TicketItem
                totalNum={infiniteScrollList?.length}
                key={'VoteRecordItem' + item?.id}
                index={index}
                item={item}
              />
            );
          })}
          <SwipeMore
            isLoadiong={ticketListLoading}
            currentPage={currentPage}
            infiniteScrollList={infiniteScrollList}
            totalPage={totalPage}
          />
        </InfiniteScroll>
      </InfiniteScrollList>
    );
    renderList = ticketListItems;
  }
  return <TicketListPage>{renderList}</TicketListPage>;
};
export default React.memo(TicketList);
