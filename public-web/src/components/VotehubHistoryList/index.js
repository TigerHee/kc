/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Empty, Global, Pagination, ThemeProvider } from '@kux/mui';
import HistoryProjectCard from 'components/Votehub/containers/components/HistoryProjectCard';
import { map } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { shallowEqual, useDispatch } from 'react-redux';
import { AppleDisclaim } from '../Compliance/AppleDisclaim';
import SwipeMore from 'src/components/Votehub/components/SwipeMore';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import ListPageHeader from '../Votehub/containers/components/ListPageHeader';
import Footer from '../Votehub/containers/Footer';
import { useResponsiveSize } from '../Votehub/hooks';
import {
  EmptyWrapper,
  HistoryListContainer,
  InfiniteScrollList,
  PaginationWrap,
  ProjectContainer,
  StyledHistoryList,
} from './styledComponents';

const List = memo(({ list }) => {
  return (
    <>
      {map(list, (item, index) => {
        if (!item) {
          return;
        }
        return (
          <div key={`history_project_${index}`} className="projectItem">
            <HistoryProjectCard
              logoUrl={item?.logoUrl}
              subName={item?.project}
              name={item?.currency}
              activityName={item?.activityName}
              date={item?.winAt}
              symbol={item?.onlineSymbol}
              hot={item?.voteNum}
            />
          </div>
        );
      })}
    </>
  );
});

export default function VotehubHistoryList() {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const size = useResponsiveSize();
  const { isRTL } = useLocale();

  const nominatedProjectList = useSelector(
    (state) => state.votehub.nominatedProjectList,
    shallowEqual,
  );
  const filters = useSelector((state) => state.votehub.filters, shallowEqual);
  const loading = useSelector((state) => state.loading.effects['votehub/pullHistoricallyProjects']);
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const [infiniteScrollList, setInfiniteScrollList] = useState([]);

  const { currentPage = 1, pageSize, total = 0, totalPage = 0 } = filters || {};

  const changePagination = useCallback(
    (event, currentPage) => {
      dispatch({
        type: 'votehub/pullHistoricallyProjects',
        payload: {
          currentPage: currentPage,
        },
      });
    },
    [dispatch],
  );

  // 获取无线数据
  const getInfiniteScrollList = useCallback(
    (currentPage) => {
      dispatch({
        type: 'votehub/pullHistoricallyProjects',
        payload: {
          currentPage,
          pageSize: 6,
        },
      }).then((data) => {
        setInfiniteScrollList(infiniteScrollList.concat(data));
      });
    },
    [dispatch, infiniteScrollList],
  );

  // 如果在app内，从app登录返回时，应再次触发init
  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });
    }
  }, [dispatch, isInApp]);

  useEffect(() => {
    if (size === 'sm') {
      dispatch({
        type: 'votehub/pullHistoricallyProjects',
        payload: {
          currentPage: 1,
          pageSize: 6,
        },
      }).then((data) => {
        setInfiniteScrollList(data);
      });
    } else if (size === 'md') {
      dispatch({
        type: 'votehub/pullHistoricallyProjects',
        payload: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
        },
      });
    } else {
      dispatch({
        type: 'votehub/pullHistoricallyProjects',
        payload: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      });
    }
  }, [dispatch, size]);

  // 是否还有下一页
  const hasMore = useMemo(
    () => !loading && currentPage < totalPage,
    [loading, currentPage, totalPage],
  );

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <Global
          styles={`
            body *{
              font-family: Roboto;
            }
            body {
              background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              .root {
                background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              }
            }
          `}
        />
        <StyledHistoryList>
          <HistoryListContainer id="voteHistoryListPage">
            <ListPageHeader title={_t('fNRL9Lq2kuwVtWoPfr9geo')} />
            <ProjectContainer data-inspector="inspector_votehub_history_list">
              {size === 'sm' ? (
                <InfiniteScrollList id="voteHistoryList">
                  <InfiniteScroll
                    pageStart={1}
                    initialLoad={false}
                    loadMore={getInfiniteScrollList}
                    hasMore={hasMore}
                    useWindow={true}
                  >
                    {!infiniteScrollList?.length && (
                      <EmptyWrapper>
                        <Empty size="small" description={_t('table.empty')} />
                      </EmptyWrapper>
                    )}
                    <List list={infiniteScrollList} />
                    <SwipeMore
                      isLoadiong={loading}
                      currentPage={currentPage}
                      infiniteScrollList={infiniteScrollList}
                      totalPage={totalPage}
                    />
                  </InfiniteScroll>
                </InfiniteScrollList>
              ) : nominatedProjectList?.length ? (
                <>
                  <List list={nominatedProjectList} />
                  {total > pageSize && size !== 'sm' ? (
                    <PaginationWrap>
                      <Pagination
                        total={total || 0}
                        current={currentPage || 1}
                        pageSize={pageSize || 10}
                        onChange={changePagination}
                      />
                    </PaginationWrap>
                  ) : null}
                </>
              ) : (
                <EmptyWrapper>
                  <Empty description={_t('table.empty')} size="large" />
                </EmptyWrapper>
              )}
            </ProjectContainer>
            <AppleDisclaim />
            <Footer />
          </HistoryListContainer>
        </StyledHistoryList>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
