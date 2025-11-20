/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, Fragment, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'dva';
import { map } from 'lodash';
import { _t } from 'src/utils/lang';
import InfiniteScroll from 'react-infinite-scroller';

import { NUMBER_DISPLAY } from '../config';
import { getUtcZeroTime } from '../selector';

import {
  List,
  Item,
  Font,
  Text,
  Number,
  Flag,
  NoDataWrapper,
  LoadingBlock,
  Wrapper,
} from './StyledComps';
import H5HeaderNew from 'components/H5HeaderNew';
import NoContent from 'assets/global/noContent.svg';
import WrappedSpin from '../WrappedSpin';


const WinnerList = () => {
  const dispatch = useDispatch();
  const { winnerInfo } = useSelector(state => state.prediction);
  const loading = useSelector(state => state.loading.effects['prediction/getWinnerList']);
  const {
    location: {
      query: { id },
    },
    push,
  } = useHistory();

  const { currentPage = 1, totalPage = 1, items = [] } = winnerInfo;
  // 回到首页
  const onBack = useCallback(
    () => {
      push('/prediction');
    },
    [push],
  );

  // 加载更多
  const loadMore = useCallback(
    (page = 1) => {
      dispatch({
        type: 'prediction/getWinnerList',
        payload: {
          id,
          currentPage: page,
        },
      });
    },
    [id, dispatch],
  );
  // 初始加载
  useEffect(
    () => {
      loadMore();
    },
    [loadMore],
  );
  return (
    <Wrapper>
      <H5HeaderNew onClickBack={onBack} title={_t('prediction.currentWinner')} />
      <List id="myRecordMain">
        {items.length ? (
          <InfiniteScroll
            pageStart={1}
            useWindow={false}
            initialLoad={false}
            hasMore={!loading && currentPage < totalPage}
            loadMore={page => !loading && loadMore(page)}
            getScrollParent={() => document.querySelector('#myRecordMain')}
          >
            <Fragment>
              {map(items, item => {
                const {
                  id,
                  rewardSource: rewardType,
                  guessNum,
                  createdAt,
                  userDisplayName = '--',
                } = item;
                const { label } = NUMBER_DISPLAY[rewardType] || {};
                return (
                  <Item key={id}>
                    <Number type={rewardType}>
                      <>
                        {rewardType === 'big_award'
                          ? _t('prediction.bigWinner')
                          : _t('prediction.luckyGuy')}
                      </>
                      <span className="space">{userDisplayName}</span>
                      <span>{!!label ? <Flag type={rewardType}>{label()}</Flag> : ''}</span>
                    </Number>
                    <Text>
                      <>{_t('prediction.winnerNum1')}</>
                      <span className="space">{guessNum}</span>
                    </Text>
                    <Text>
                      <>{_t('prediction.submitTime1')}</>
                      <span>
                        <span className="space">{getUtcZeroTime(createdAt, 'YYYY/MM/DD HH:mm:ss')}</span>
                        <>(UTC)</>
                      </span>
                    </Text>
                  </Item>
                );
              })}
            </Fragment>
            <Fragment>
              {!!loading ? (
                <WrappedSpin spinning={loading} loading={_t('oneCoin.infinite.scroll.loading')}>
                  <LoadingBlock />
                </WrappedSpin>
              ) : (
                ''
              )}
            </Fragment>
          </InfiniteScroll>
        ) : (
          <WrappedSpin spinning={loading}>
            <NoDataWrapper>
              <img src={NoContent} alt="" />
              <br />
              <Font>{_t('apiKing.noData')}</Font>
            </NoDataWrapper>
          </WrappedSpin>
        )}
      </List>
    </Wrapper>
  );
};

export default WinnerList;
