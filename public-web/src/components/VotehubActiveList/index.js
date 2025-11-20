/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Empty, Global, Pagination, ThemeProvider } from '@kux/mui';
import ProjectCard from 'components/Votehub/containers/components/ProjectCard';
import { map } from 'lodash';
import { memo, useCallback, useEffect, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { shallowEqual, useDispatch } from 'react-redux';
import SwipeMore from 'src/components/Votehub/components/SwipeMore';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { AppleDisclaim } from '../Compliance/AppleDisclaim';
import ListPageHeader from '../Votehub/containers/components/ListPageHeader';
import ProjectDetailModal from '../Votehub/containers/components/ProjectDetailModal';
import TicketModal from '../Votehub/containers/components/TicketModal';
import Footer from '../Votehub/containers/Footer';
import { useInitActivityStatus, useResponsiveSize } from '../Votehub/hooks';
import {
  ActiveListContainer,
  EmptyWrapper,
  InfiniteScrollList,
  PaginationWrap,
  ProjectContainer,
  StyledActiveList,
} from './styledComponents';

const List = memo(({ list, currentPage }) => {
  // 是否显示rank的规则
  const showRank = useMemo(() => {
    if (list?.length && list[0]?.voteNumber && currentPage < 2) {
      return true;
    }
    return false;
  }, [list, currentPage]);

  return (
    <>
      {map(list, (item, index) => {
        if (!item) {
          return;
        }

        const isRank = showRank && index < 3;

        return (
          <div key={`current_project_${index}`} className="projectItem">
            <ProjectCard
              isProcessing={true}
              rank={isRank ? index + 1 : 0}
              hot={item?.voteNumber}
              logoUrl={item?.logoUrl}
              subName={item?.project}
              name={item?.currency}
              description={item?.description}
              item={item}
            />
          </div>
        );
      })}
    </>
  );
});

const PCListComp = memo(({ size }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.votehub.filters, shallowEqual);
  const pageInfo = useSelector((state) => state.votehub.pageInfo, shallowEqual);
  const currenctPojectList = useSelector((state) => state.votehub.currenctPojectList, shallowEqual);
  const { currentPage = 1, pageSize, total = 0 } = filters || {};
  const { id } = pageInfo || {};

  const changePagination = useCallback(
    (event, currentPage) => {
      dispatch({
        type: 'votehub/pullActivityProjects',
        payload: {
          currentPage: currentPage,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({
      type: 'votehub/updateFilters',
      payload: {
        currentPage: 1,
        pageSize: size === 'md' ? 10 : 12,
        total: 0,
      },
    });

    return () => {
      dispatch({
        type: 'votehub/updateFilters',
        payload: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      });
    };
  }, [dispatch, size]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'votehub/pullActivityProjects@polling',
      });
      return () => {
        dispatch({
          type: 'votehub/pullActivityProjects@polling:cancel',
        });
      };
    }
  }, [dispatch, id]);

  if (!currenctPojectList?.length) {
    return (
      <EmptyWrapper>
        <Empty description={_t('table.empty')} size="large" />
      </EmptyWrapper>
    );
  }
  return (
    <>
      <List list={currenctPojectList} currentPage={currentPage} />
      {total > pageSize ? (
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
  );
});

const H5ListComp = memo(() => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.votehub.filters, shallowEqual);
  const pageInfo = useSelector((state) => state.votehub.pageInfo, shallowEqual);
  const currenctPojectList = useSelector((state) => state.votehub.currenctPojectList, shallowEqual);
  const loading = useSelector((state) => state.loading.effects['votehub/pullActivityProjects']);

  const { currentPage = 1, totalPage = 0 } = filters || {};
  const { id } = pageInfo || {};

  useEffect(() => {
    dispatch({
      type: 'votehub/updateFilters',
      payload: {
        currentPage: 1,
        pageSize: 6,
        total: 0,
      },
    });
    return () => {
      dispatch({
        type: 'votehub/updateFilters',
        payload: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      });
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'votehub/pullActivityProjects@polling',
      });
      return () => {
        dispatch({
          type: 'votehub/pullActivityProjects@polling:cancel',
        });
      };
    }
  }, [dispatch, id]);

  // 获取无线数据
  const getInfiniteScrollList = useCallback(
    (currentPage) => {
      dispatch({
        type: 'votehub/pullActivityProjects',
        payload: {
          currentPage: 1,
          pageSize: 6 * currentPage,
        },
      });
    },
    [dispatch],
  );

  // 是否还有下一页
  const hasMore = useMemo(
    () => !loading && currentPage < totalPage,
    [loading, currentPage, totalPage],
  );

  return (
    <InfiniteScrollList id="voteHistoryList">
      <InfiniteScroll
        pageStart={1}
        initialLoad={false}
        loadMore={getInfiniteScrollList}
        hasMore={hasMore}
        useWindow={true}
      >
        {!currenctPojectList?.length && (
          <EmptyWrapper>
            <Empty size="small" description={_t('table.empty')} />
          </EmptyWrapper>
        )}
        <List list={currenctPojectList} currentPage={currentPage} />
        <SwipeMore
          isLoadiong={loading}
          currentPage={currentPage}
          infiniteScrollList={currenctPojectList}
          totalPage={totalPage}
        />
      </InfiniteScroll>
    </InfiniteScrollList>
  );
});

const Content = memo(() => {
  useInitActivityStatus();
  const size = useResponsiveSize();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user, shallowEqual);

  // 获取当前活动信息
  useEffect(() => {
    dispatch({
      type: 'votehub/pullCurrentActivity',
    });
  }, [dispatch]);

  // 获取用户可用票数
  useEffect(() => {
    if (user) {
      dispatch({
        type: 'votehub/pullAvailableVotes',
      });
    }
  }, [user, dispatch]);

  return size === 'sm' ? <H5ListComp /> : <PCListComp size={size} />;
});

export default function VotehubActiveList() {
  const { isRTL } = useLocale();
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

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
        <StyledActiveList id="voteVotingListPage">
          <ActiveListContainer>
            <ListPageHeader title={_t('boBzvBpw2ArscPq9LYEFt5')} />
            <ProjectContainer data-inspector="inspector_votehub_voting_list">
              <Content />
            </ProjectContainer>
            <AppleDisclaim />
            <Footer />
          </ActiveListContainer>
        </StyledActiveList>
        <ProjectDetailModal />
        <TicketModal />
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
