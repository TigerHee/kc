/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'components/Toast';
import { _t, _tHTML } from 'tools/i18n';
import BaseComponent from '../BaseComponent';
import { ActivityStatus } from 'config/base';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@connect()
@injectLocale
class BaseAward extends React.Component {
  state = {
    award: {},
  };

  componentDidMount() {
    this.getAward();
  }

  getAward = async () => {
    const { item, dispatch } = this.props;
    const { code, type } = item;
    dispatch({
      type: 'activity/getReward',
      payload: {
        type,
        code,
      },
    }).then(
      (data) => {
        this.setState({
          award: data,
        });
      },
      (error) => {
        message.error(error.msg);
      },
    );
  };

  render() {
    const { award } = this.state;
    return (
      <div className={style.awardBox}>
        <BaseComponent baseHead={_t('prize.detail')}>
          <div className={style.award}>
            {award.isWinning ? (
              <span>{_t('my.prize', { n: award.currentUserReward, coin: '' })}</span>
            ) : (
              <span>{_t('prize.missed')}</span>
            )}
          </div>
        </BaseComponent>
      </div>
    );
  }
}

@connect((state) => {
  return {
    user: state.user.user,
  };
})
@injectLocale
export default class Award extends React.Component {
  getSteps = () => {
    const {
      activityData: { status },
      user,
    } = this.props;
    if (status === ActivityStatus.WAIT_START || status === ActivityStatus.PROCESSING) {
      return 0;
    }
    if (!user) {
      return 1;
    }
    return 2;
  };

  render() {
    const { item } = this.props;
    const steps = {
      0: null,
      1: (
        <div className={style.awardBox}>
          <BaseComponent baseHead={_t('prize.detail')}>
            <div className={style.award}>
              <p className={style.login}>{_tHTML('login.to.view.ranking')}</p>
            </div>
          </BaseComponent>
        </div>
      ),
      2: <BaseAward item={item} />,
    };
    const step = this.getSteps();
    const content = steps[step];
    return <React.Fragment>{content}</React.Fragment>;
  }
}
