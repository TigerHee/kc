/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 17:03:30
 * @FilePath: /public-web/src/components/Votehub/recordList/components/NominateList/index.js
 * @Description:
 */
import { Empty, Pagination } from '@kux/mui';
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
import NominateItem, { NominateItemH5 } from './NominateItem';
import { NominateListPage, PaginationWrap } from './styled';

// 提名记录
const NominateList = () => {
  const dispatch = useDispatch();
  const isMobileApp = useIsMobileApp();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const { nominateList = {} } = useSelector(
    (state) => state.votehub,
    keysEquality(['nominateList']),
  );

  const nominateListLoading = useSelector(
    (state) => state.loading.effects['votehub/pullNominateList'],
  );
  const { currentPage = 1, pageSize = 10, totalNum = 0, totalPage = 0, items = [] } = nominateList;

  const [infiniteScrollList, setInfiniteScrollList] = useState([]);
  // 是否还有下一页
  const hasMore = useMemo(
    () => !nominateListLoading && currentPage < totalPage,
    [nominateListLoading, currentPage, totalPage],
  );

  // 获取数据
  const getList = useCallback(
    (currentPage, pageSize) => {
      dispatch({
        type: 'votehub/pullNominateList',
        payload: {
          currentPage,
          pageSize,
        },
      });
    },
    [dispatch],
  );

  // 获取无线数据
  const getInfiniteScrollList = useCallback(
    (currentPage) => {
      dispatch({
        type: 'votehub/pullNominateList',
        payload: {
          currentPage,
          pageSize: 10,
        },
      }).then((data) => {
        setInfiniteScrollList(infiniteScrollList.concat(data?.nominateList?.items));
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
  }, [isLogin, isMobileApp, dispatch]);

  const changePagination = useCallback((event, page, newPageSize) => {
    getList(page, newPageSize);
  }, []);

  let renderList = null;
  let nominateItems = null;
  if (!isMobileApp) {
    if (items.length > 0) {
      nominateItems = items.map((item, index) => {
        return <NominateItem key={'NominateItem' + item?.id} item={item} />;
      });
    }
    renderList = (
      <>
        {isEmpty(nominateItems) && (
          <EmptyWrapper>
            <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
          </EmptyWrapper>
        )}
        {nominateItems}
        {totalPage > 1 && (
          <PaginationWrap>
            <Pagination
              total={totalNum}
              current={currentPage}
              pageSize={pageSize}
              onChange={changePagination}
            />
          </PaginationWrap>
        )}
      </>
    );
  } else {
    const voteRecordItems = (
      <InfiniteScrollList id="nominateListPage">
        <InfiniteScroll
          pageStart={1}
          initialLoad={false}
          loadMore={getInfiniteScrollList}
          hasMore={hasMore}
          useWindow={true}
          className="InfiniteDiv"
        >
          {isEmpty(infiniteScrollList) && (
            <EmptyWrapper>
              <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
            </EmptyWrapper>
          )}
          {infiniteScrollList.map((item, index) => {
            return <NominateItemH5 key={'NominateItem' + item?.id} item={item} />;
          })}
          <SwipeMore
            isLoadiong={nominateListLoading}
            currentPage={currentPage}
            infiniteScrollList={infiniteScrollList}
            totalPage={totalPage}
          />
        </InfiniteScroll>
      </InfiniteScrollList>
    );
    renderList = voteRecordItems;
  }
  return <NominateListPage>{renderList}</NominateListPage>;
};
export default React.memo(NominateList);
