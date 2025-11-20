/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import clxs from 'classnames';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import JsBridge from 'utils/jsBridge';
import { ThemeProvider, Button } from '@kufox/mui';
import { ArrowDownOutlined } from '@kufox/icons';
import KCHeader from 'components/Header/KCHeader';
import { useIsMobile } from 'components/Responsive';
import KCFooter from 'components/Footer/KCFooter';
import { linkToTrade } from 'utils/linkToTrade';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import styles from './style.less';

const RankTableList = ({ symbol = '', list = [] }) => {
  return (
    <table className={styles.tableList}>
      <thead>
        <tr>
          <th>Ranking</th>
          <th>Rewards</th>
          <th>User ID</th>
          <th>Email/Phone</th>
          <th>{symbol ? symbol + '-' : ''}Trading Volume</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item, index) => {
          let serial = index + 1;
          if (serial < 10) {
            serial = `0${serial}`;
          }
          return (
            <tr key={index}>
              <td>
                <span>{serial}</span>
              </td>
              <td>
                {item.rewards} <span className={styles.unit}>{item.rewardCurrency}</span>
              </td>
              <td>{item.userId}</td>
              <td>{item.emailorPhone}</td>
              <td>{item.tradingVolume}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const RankList = ({ list = [] }) => {
  return (
    <ul className={styles.rankList}>
      {list.map((item, index) => {
        let serial = index + 1;
        if (serial < 10) {
          serial = `0${serial}`;
        }
        return (
          <li className={styles.item} key={index}>
            <div className={styles.row}>
              <span>
                <span className={styles.serial}>
                  <span>{serial}</span>
                </span>
                <span className={styles.uid}>ID:{item.userId}</span>
              </span>
              <span className={styles.emailOrPhone}>{item.emailorPhone}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Rewards</span>
              <span className={styles.value}>{item.rewards}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Trading Volume</span>
              <span className={styles.value}>{item.tradingVolume}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default brandCheckHoc((props) => {
  const dispatch = useDispatch();
  const { isInApp, supportCookieLogin } = useSelector((state) => state.app);
  const { isLogin, user } = useSelector((state) => state.user);
  const { rankData, activityData, joinStatus, joinStatusLoading } = useSelector(
    (state) => state.leaderboard,
  );

  const isMobile = useIsMobile();

  const [viewAll, setViewAll] = useState(false);

  const { match: { params: { id } } = {} } = props;

  useEffect(() => {
    if (!id) {
      window.location.href = '/';
    }

    if (isLogin) {
      dispatch({ type: 'app/getUserInfo' });
    }

    dispatch({
      type: 'leaderboard/getActivityData',
      payload: {
        id,
      },
    });

    dispatch({
      type: 'leaderboard/getRankData',
      payload: {
        activityId: id,
      },
    });
  }, [isLogin, dispatch, props, id]);

  useEffect(() => {
    if (user && user.uid) {
      dispatch({
        type: 'leaderboard/getJoinStatus',
        payload: {
          activityId: id,
          userId: user.uid,
        },
      });
    }
  }, [dispatch, user, id]);

  const handleLogin = useCallback(() => {
    if (isInApp && supportCookieLogin) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/login',
        },
      });
      return;
    }
    dispatch({
      type: 'user/update',
      payload: {
        showLoginDrawer: true,
      },
    });
  }, [isInApp, supportCookieLogin, dispatch]);

  const onRegister = () => {
    if (!isLogin) {
      handleLogin();
    } else {
      if (joinStatus) {
        gotoMarket();
      } else {
        dispatch({
          type: 'leaderboard/join',
          payload: {
            activityId: id,
            userId: user.uid,
          },
        });
      }
    }
  };

  const gotoMarket = () => {
    const symbol = activityData?.symbolList[0];
    if (isInApp) {
      const params = symbol ? `symbol=${symbol}` : '';
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/market?${params}`,
        },
      });
    } else {
      linkToTrade(symbol);
    }
  };

  const formatUtcDateTime = (time) => moment(time).utcOffset(0).format('YYYY/MM/DD HH:mm:ss');

  const list =
    rankData && rankData.userRankingVolist
      ? viewAll
        ? rankData.userRankingVolist
        : rankData.userRankingVolist.slice(0, 10)
      : [];

  if (!activityData) return null;

  const symbolList = activityData.symbolList || [];
  const symbol = symbolList.length ? symbolList[0].split('-')[0] : '';
  const buttonDisabled = activityData.status === 2;
  return (
    <ThemeProvider>
      <div>
        {!isInApp && !isMobile && <KCHeader theme="light" />}
        <div>
          <div
            className={styles.banner}
            style={activityData.rgb ? { backgroundColor: `${activityData.rgb}` } : {}}
          >
            <div className={styles.content}>
              <div
                className={styles.pic}
                style={{ backgroundImage: `url(${activityData.activityPictureUri})` }}
               />
              <div className={styles.info}>
                <h3 className={styles.title}>{activityData.activityDisplayName}</h3>
                <div className={styles.period}>
                  Activity Period {formatUtcDateTime(activityData.activityStart)} -{' '}
                  {formatUtcDateTime(activityData.activityEnd)} (UTC)
                </div>
                <Button
                  className={styles.register}
                  onClick={onRegister}
                  loading={joinStatusLoading}
                  disabled={buttonDisabled}
                  style={
                    !buttonDisabled && activityData.registerButtonRgb
                      ? { backgroundColor: `${activityData.registerButtonRgb}` }
                      : {}
                  }
                >
                  {joinStatus && activityData.status !== 2 ? 'Trade Now' : 'Register Now'}
                </Button>
              </div>
            </div>
          </div>

          <section className={clxs(styles.section, styles.leaderboard)}>
            <div className={styles.hd}>
              <div className={styles.title}>
                <i className={clxs(styles.icon, styles.iconRank)} />
                <span>Trading Leaderboard</span>
              </div>
              <div className={styles.period}>
                Activity Period {formatUtcDateTime(activityData.activityStart)} -{' '}
                {formatUtcDateTime(activityData.activityEnd)} (UTC)
              </div>
            </div>
            <div className={styles.bd}>
              {!!list.length &&
                (isMobile ? (
                  <RankList list={list} />
                ) : (
                  <RankTableList list={list} symbol={symbol} />
                ))}

              {!!list.length && (
                <div className={styles.addon}>
                  {rankData.userRankingVolist.length > 10 && !viewAll && (
                    <Button
                      variant="text"
                      onClick={() => {
                        setViewAll(true);
                      }}
                    >
                      <span>View more</span>
                      <ArrowDownOutlined />
                    </Button>
                  )}

                  <div className={clxs(styles.updated, isMobile && styles.newline)}>
                    Updated at: {formatUtcDateTime(rankData.updateTime)}(UTC)
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className={clxs(styles.section, styles.rules)}>
            <div className={styles.hd}>
              <div className={styles.title}>
                <i className={clxs(styles.icon, styles.iconNote)} />
                <span>Tournament Rules</span>
              </div>
            </div>
            <div
              className={styles.bd}
              dangerouslySetInnerHTML={{ __html: activityData.activityRule }}
             />
          </section>
        </div>
        {!isInApp && !isMobile && <KCFooter />}
      </div>
    </ThemeProvider>
  );
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
