/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import { connect } from 'react-redux';
import BaseTable from '../BaseTable';
import { ActivityStatus } from 'config/base';
import { _t, _tHTML } from 'tools/i18n';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@injectLocale
class RankTable extends React.Component {
  state = {
    data: [],
    myRank: {},
  };

  componentDidMount = async () => {
    this.getRanks();
    this.getMyRank();
  };

  getRanks = async () => {
    const {
      dispatch,
      item: { code },
    } = this.props;
    const data = await dispatch({
      type: 'activity/getCompetionRank',
      payload: {
        code,
      },
    });
    this.setState({
      data,
    });
  };

  getMyRank = async () => {
    const {
      dispatch,
      item: { code },
    } = this.props;
    const data = await dispatch({
      type: 'activity/getMyRank',
      payload: {
        code,
      },
    });
    this.setState({
      myRank: data,
    });
  };

  columns = () => {
    return [
      {
        title: _t('ranking'),
        dataIndex: 'ranking',
      },
      {
        title: _t('account'),
        dataIndex: 'user',
      },
      {
        title: _t('transaction.amount'),
        dataIndex: 'amount',
        render(v, { record }) {
          const { currency } = record || {};
          return (
            <span>
              {v}
              {currency}
            </span>
          );
        },
      },
    ];
  };

  getSteps = () => {
    const { activityData } = this.props;
    const {
      campaignResponse: { status },
      userAlreadyEnroll,
      isEnroll,
    } = activityData;
    if (status === ActivityStatus.PROCESSING) {
      if (isEnroll) {
        if (userAlreadyEnroll) {
          return 2;
        }
        return 0;
      }
      return 2;
    }
    if (status === ActivityStatus.WAIT_REWARD || status === ActivityStatus.OVER) {
      if (isEnroll) {
        if (userAlreadyEnroll) {
          return 2;
        }
        return 1;
      }
      return 2;
    }
  };

  render() {
    const { data, myRank } = this.state;
    const step = this.getSteps();
    const steps = {
      0: [<h5 key={1}>{_t('ranking.list.help')}</h5>, <p key={2}>{_t('data.update.per.hour')}</p>],
      1: [<h5 key={1}>{_t('final.ranking')}</h5>, <p key={2}>{_t('data.update.per.hour')}</p>],
      2: [
        <h5 key={1}>
          {_t('current.ranking')}
          <span>{myRank.ranking || '--'}</span>({myRank.amount || '--'}
          {myRank.currency})
        </h5>,
        <p key={2}>{_t('data.update.per.hour')}</p>,
      ],
    };
    return (
      <div className={style.rankTable}>
        {steps[step]}
        <BaseTable columns={this.columns()} dataSource={data} pagination={false} />
      </div>
    );
  }
}
// 0,待开始，1，进行中，2，待发奖，3，已结束
@connect((state) => {
  return {
    user: state.user.user,
  };
})
@injectLocale
export default class CompetRankTable extends React.Component {
  getSteps = () => {
    const { user, activityData } = this.props;
    const {
      campaignResponse: { status },
    } = activityData;
    if (status === ActivityStatus.WAIT_START) {
      return 0;
    }
    if (!user) {
      return 1;
    }
    return 2;
  };

  render() {
    const { item, dispatch, activityData } = this.props;
    const steps = {
      0: null,
      1: (
        <div className={style.Needlogged}>
          <p>{_tHTML('login.to.view.ranking')}</p>
          <p>{_t('data.update.per.hour')}</p>
        </div>
      ),
      2: <RankTable item={item} activityData={activityData || {}} dispatch={dispatch} />,
    };
    const step = this.getSteps();
    const content = steps[step];
    return <React.Fragment>{content}</React.Fragment>;
  }
}
