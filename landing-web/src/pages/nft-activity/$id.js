/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import clxs from 'classnames';
import moment from 'moment';
import { map } from 'lodash';
import { connect } from 'dva';
import { Pagination, Button, Spin } from '@kufox/mui';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import KCHeader from 'components/Header/KCHeader';
import JsBridge from 'utils/jsBridge';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

import { useIsMobile } from 'components/Responsive';
import KCFooter from 'components/Footer/KCFooter';
import styles from './style.less';

const RankTableList = ({ list = [] }) => {
  return (
    <table className={styles.tableList}>
      <thead>
        <tr>
          <th>NO</th>
          <th>User ID</th>
          <th>Email/Phone</th>
          <th style={{ textAlign: 'center' }}>Winning Tickets / Your Tickets</th>
        </tr>
      </thead>
      <tbody>
        {map(list, (item) => {
          const { rank, uid, uidOrPhone } = item;
          let serial = rank;
          if (serial < 10) {
            serial = `0${serial}`;
          }
          const str = `1 / ${item.bitNumber}`;
          return (
            <tr key={rank}>
              <td>
                <span>{serial}</span>
              </td>
              <td>{uid}</td>
              <td>{uidOrPhone}</td>
              <td style={{ textAlign: 'center' }}>{str}</td>
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
      {list.map((item) => {
        const { rank, uid, uidOrPhone } = item;
        let serial = rank;
        if (serial < 10) {
          serial = `0${serial}`;
        }
        const str = `1 / ${item.bitNumber}`;
        return (
          <li className={styles.item} key={rank}>
            <div className={styles.row}>
              <span>
                <span className={styles.serial}>
                  <span>{serial}</span>
                </span>
                <span className={styles.uid}>ID:{uid}</span>
              </span>
              <span className={styles.emailOrPhone}>{uidOrPhone}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Winning Tickets / Your Tickets</span>
              <span className={styles.value}>{str}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const NFTActivity = (props) => {
  const [joinLoading, setJoinLoading] = useState(false);
  const isMobile = useIsMobile();
  const { message } = useSnackbar();
  const isInApp = JsBridge.isApp();

  const {
    match: { params: { id } } = {},
    dispatch,
    isLogin,
    activityData,
    joinStatus,
    rankData,
    pageNo,
    rankLoading,
    pageSize,
  } = props;
  useEffect(() => {
    if (!id) {
      window.location.href = '/';
    }

    if (isLogin) {
      dispatch({ type: 'app/getUserInfo' });
    }

    dispatch({
      type: 'nftActivity/getActivityData',
      payload: {
        id,
      },
    });

    dispatch({
      type: 'nftActivity/getRankData',
      payload: {
        activityId: id,
      },
    });
  }, [isLogin, dispatch, id]);

  useEffect(() => {
    if (isLogin) {
      setJoinLoading(true);
      dispatch({
        type: 'nftActivity/getJoinStatus',
        payload: {
          activityId: id,
        },
      }).finally(() => {
        setJoinLoading(false);
      });
    }
  }, [dispatch, isLogin, id]);

  const handleLogin = useCallback(() => {
    dispatch({
      type: 'user/update',
      payload: {
        showLoginDrawer: true,
      },
    });
  }, [dispatch]);

  const gotoMarket = () => {
    const navigateUrl = activityData?.navigateUrl;
    window.location.href = navigateUrl;
  };
  const onChange = (__, value) => {
    dispatch({
      type: 'nftActivity/getRankData',
      payload: {
        activityId: id,
        pageNo: value,
      },
    });
  };

  const formatUtcDateTime = (time) => moment(time).utcOffset(0).format('YYYY/MM/DD HH:mm:ss');

  const list = rankData.records;

  if (!activityData) return null;

  const {
    bannerUrl,
    bannerRgb,
    buttonRgb,
    displayName,
    end,
    start,
    rule,
    status, // -1.未开始，0.进行中，1.已结束 2.抽签中 3.抽签结束 4.展示结束
  } = activityData; // 只有进行中且（未登录或登陆了但未参加）才能显示为 注册
  let nextAction = 'buy';
  if (status === 0 && !isLogin) {
    nextAction = 'login';
  } else if (status === 0 && isLogin && !joinStatus) {
    nextAction = 'register';
  }
  // 活动未开始，不需要其他判断
  if (status === -1) {
    nextAction = 'register';
  }
  const onRegister = () => {
    // 未登陆且当前是可注册活动状态时需要登陆
    if (nextAction === 'login') {
      handleLogin();
      return;
    }
    // 登陆了但未注册活动且活动进行中时，才能注册
    if (nextAction === 'register') {
      setJoinLoading(true);
      try {
        dispatch({
          type: 'nftActivity/join',
          payload: {
            activityId: id,
          },
        }).then(() => {
          dispatch({
            type: 'nftActivity/getJoinStatus',
            payload: {
              activityId: id,
            },
          }).finally(() => {
            setJoinLoading(false);
          });
        });
      } catch (e) {
        setJoinLoading(false);
        if (e && e.msg) {
          message.error(e?.msg);
        }
      }
      return;
    }
    // 其他情况就去购买
    gotoMarket();
  };
  const averageAmount =
    rankData.assetSnapshot && rankData.assetSnapshot.averageAmount
      ? rankData.assetSnapshot.averageAmount
      : 0;
  const averageCurrency =
    rankData.assetSnapshot && rankData.assetSnapshot.currency ? rankData.assetSnapshot.currency : 0;
  const bitStr = `You held an average of <span style="color: rgb(45, 189, 150);">${averageAmount} ${averageCurrency}</span>. Congratulations, you won!`;
  const notBitStr = `You held an average of <span style="color: rgb(45, 189, 150);">${averageAmount} ${averageCurrency}</span>. Sorry, you did not win this time.`;

  return (
    <div>
      {!isInApp && !isMobile && <KCHeader theme="light" />}
      <div>
        <div className={styles.banner} style={bannerRgb ? { backgroundColor: `${bannerRgb}` } : {}}>
          <div className={styles.content}>
            <div className={styles.pic} style={{ backgroundImage: `url(${bannerUrl})` }} />
            <div className={styles.info}>
              <h3 className={styles.title}>{displayName}</h3>
              <div className={styles.period}>
                Activity Period {formatUtcDateTime(start)} - {formatUtcDateTime(end)} (UTC)
              </div>
              <Button
                className={styles.register}
                onClick={() => onRegister()}
                loading={joinLoading}
                // 活动未开始，不能点
                disabled={status === -1}
                style={buttonRgb ? { backgroundColor: `${buttonRgb}` } : {}}
              >
                {nextAction === 'buy' ? 'Buy Now' : 'Register Now'}
              </Button>
            </div>
          </div>
        </div>

        <section className={clxs(styles.section, styles.leaderboard)}>
          <div className={styles.hd}>
            <div className={styles.title}>
              <i className={clxs(styles.icon, styles.iconRank)} />
              <span>List of Winners</span>
            </div>
            {status >= 3 && rankData.isBit !== null && (
              <div className={styles.period}>
                <span
                  className={styles.resultTip}
                  dangerouslySetInnerHTML={{ __html: rankData.isBit ? bitStr : notBitStr }}
                />
                <div className={clxs(styles.updated, isMobile && styles.newline)}>
                  Updated at: {formatUtcDateTime(rankData.updateTime)}(UTC)
                </div>
              </div>
            )}
          </div>
          <div className={styles.bd}>
            {!!list.length &&
              !rankLoading &&
              (isMobile ? <RankList list={list} /> : <RankTableList list={list} />)}
            {rankLoading && (
              <div className={styles.spinContainer}>
                <Spin size={'medium'} />
              </div>
            )}
            {list.length > 0 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  onChange={onChange}
                  total={rankData.totalPage * pageSize}
                  pageSize={pageSize}
                  current={pageNo}
                />
              </div>
            )}
          </div>
        </section>

        <section className={clxs(styles.section, styles.rules)}>
          <div className={styles.hd}>
            <div className={styles.title}>
              <i className={clxs(styles.icon, styles.iconNote)} />
              <span>Activity Rules</span>
            </div>
          </div>
          <div className={styles.bd} dangerouslySetInnerHTML={{ __html: rule }} />
        </section>
      </div>
      {!isInApp && !isMobile && <KCFooter />}
    </div>
  );
};

const Page = connect((state) => {
  const { user: userState, nftActivity } = state;
  const { isLogin } = userState;
  const { rankData, activityData, joinStatus, joinStatusLoading, filter, rankLoading } =
    nftActivity;
  return {
    isLogin: Boolean(isLogin),
    rankData,
    activityData,
    joinStatus,
    joinStatusLoading,
    rankLoading,
    pageNo: filter.pageNo,
    pageSize: filter.pageSize,
  };
})(NFTActivity);

export default brandCheckHoc(Page, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
