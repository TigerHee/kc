/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { map, debounce, filter, toNumber } from 'lodash';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { NewTabs as Tabs } from '@kufox/mui';
import InfiniteScroll from 'react-infinite-scroller';
import { _t } from 'utils/lang';
import { LANDING_HOST } from 'utils/siteConfig';
import JsBridge from 'utils/jsBridge';
import { separateNumber } from 'helper';
import { TABS, NUMBER_DISPLAY, PRIZE_CODE, THEME_COLOR } from '../config';
import H5HeaderNew from 'components/H5HeaderNew';
import { getUtcZeroTime } from '../selector';

import NoContent from 'assets/global/noContent.svg';
import WrappedSpin from '../WrappedSpin';
// import FiltorSvg from 'assets/global/filtor.svg';

const { Tab } = Tabs;

const WrapTabs =styled(Tabs)`
  & span{
    height: 4px !important;
    background: ${THEME_COLOR.primary} !important;
  }
`

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  .space {
    margin: 0 ${px2rem(2)};
  }
`;
const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 ${px2rem(16)};
  @media (min-width: 1040px) {
    ::-webkit-scrollbar {
      background: transparent;
      width: 6px;
      height: 2px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: rgba(0, 20, 42, 0.2);
    }
  }
`;
const Item = styled.div`
  padding: ${px2rem(24)} 0;
  border-bottom: ${px2rem(1)} solid rgba(0, 20, 42, 0.08);
`;
const Font = styled.span`
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  color: rgba(0, 20, 42, 0.3);
`;
const Text = styled(Font)`
  display: flex;
  align-items: center;
`;
const Number = styled(Text)`
  color: ${props => NUMBER_DISPLAY[props.type]?.color};
  span.guessNum {
    font-weight: ${props => (props.isWinning ? 500 : 'normal')};
  }
`;
const Amount = styled(Font)`
  display: block;
  color: ${props => NUMBER_DISPLAY[props.type]?.amountColor};
`;
const Flag = styled.div`
  padding: 0 ${px2rem(4)};
  border-radius: ${px2rem(2)};
  background: ${props => NUMBER_DISPLAY[props.type]?.color};
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  color: #fff;
  margin-left: ${px2rem(8)};
`;
const NoDataWrapper = styled.div`
  text-align: center;
  margin-top: ${px2rem(136)};
  img {
    width: ${px2rem(100)};
  }
`;

const LoadingBlock = styled.div`
  height: ${px2rem(100)};
`;

const url = `/prediction`;
const appUrl = `${LANDING_HOST}/prediction`;
// 格式化场次展示
const formatCommitSession = ({ start, end, current, total }) => {
  if (start) {
    const [date, startTime] = getUtcZeroTime(start, 'MM/DD HH:mm').split(' ');
    const endTime = getUtcZeroTime(end, 'HH:mm');
    return `${date}-${current} ${startTime}-${endTime} (UTC)`;
  }
  return '--';
};

export default React.memo(props => {
  const { push, location: { query } } = useHistory();

  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const { guessRecord } = useSelector(state => state.prediction);
  const loading = useSelector(state => state.loading.effects['prediction/pullGuessRecord']);
  const initType = query?.queryType ? toNumber(query?.queryType) : 0; // queryType 是用于中奖信息弹窗定位到已中奖Tab
  const [type, setType] = useState(initType);

  const { currentPage = 1, totalPage = 1, items = [] } = guessRecord[type] || {};

  const loadMore = useCallback(
    (page = 1) => {
      dispatch({
        type: 'prediction/pullGuessRecord',
        payload: {
          type,
          currentPage: page,
        },
      });
    },
    [type, dispatch],
  );

  // 回到Home
  const backHome = useCallback(
    debounce(
      () => {
        // 跳转
        if (isInApp) {
          const _url = `/link?url=${encodeURIComponent(appUrl)}`;
          JsBridge.open({
            type: 'jump',
            params: {
              url: _url,
            },
          });
        } else {
          push(url);
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [appUrl, url],
  );

  useEffect(
    () => {
      if (isLogin === false) {
        backHome();
      }
    },
    [backHome, isLogin],
  );
  useEffect(
    () => {
      loadMore();
    },
    [type, loadMore],
  );

  return (
    <Wrapper>
      <H5HeaderNew isInApp={isInApp} onClickBack={backHome} title={_t('prediction.entrance.list')} />
      <WrapTabs
        style={{ padding: `0 ${px2rem(16)}` }}
        value={type}
        onChange={(e, value) => setType(value)}
      >
        {map(TABS, ({ label, value }) => {
          return <Tab key={value} label={label()} />;
        })}
      </WrapTabs>
      <List>
        {items.length ? (
          <InfiniteScroll
            key={type}
            pageStart={1}
            useWindow={false}
            initialLoad={false}
            hasMore={!loading && currentPage < totalPage}
            loadMore={page => !loading && loadMore(page)}
          >
            <Fragment>
              {map(items, item => {
                const { id, isWinning, rewardSource, guessNum, createdAt, prizes } = item;
                const rewardType = !isWinning ? 'no_reward' : rewardSource;
                const { label, amountDesc, bizType } = NUMBER_DISPLAY[rewardType] || {};
                const _prizes = filter(prizes, v => v.bizType === bizType);
                return (
                  <Item key={id}>
                    <Number type={rewardType} isWinning={isWinning}>
                      <>{isWinning ? _t('prediction.winnerNum1') : _t('prediction.quizPrice1')}</>
                      <span className="guessNum space">{guessNum}</span>
                      <>{!!label ? <Flag type={rewardType}>{label()}</Flag> : ''}</>
                    </Number>
                    <Text>
                      <>{_t('prediction.submitTime1')}</>
                      <span className="space">{getUtcZeroTime(createdAt, 'YYYY/MM/DD HH:mm')}</span>
                    </Text>
                    <Text>
                      <>{_t('prediction.submitScreenings1')}</>
                      <span className="space">{formatCommitSession(item)}</span>
                    </Text>
                    <Fragment>
                      {map(_prizes, ({ id: prizeId, prizeCode, amount }) => {
                        const { label: prizeLabel, valueRender } =
                          PRIZE_CODE[`${rewardType}-${prizeCode}`] || PRIZE_CODE['no_reward-USDT'];
                        return (
                          <Amount type={rewardType} key={prizeId}>
                            <>{prizeLabel()}</>
                            <span className="space">{valueRender(separateNumber(amount))}</span>
                            <>{!!amountDesc ? <Font>{amountDesc()}</Font> : ''}</>
                          </Amount>
                        );
                      })}
                    </Fragment>
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
              <Font>{_t('prediction.noSubmit')}</Font>
            </NoDataWrapper>
          </WrappedSpin>
        )}
      </List>
    </Wrapper>
  );
});
