/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'components/Toast';
import BaseComponent from '../BaseComponent';
import { Link } from 'components/Router';
import SvgIcon from 'components/common/KCSvgIcon';
import { _t } from 'tools/i18n';
import style from './style.less';
import { showDatetime } from 'helper';
import { ActivityStatus } from 'config/base';
import { injectLocale } from '@kucoin-base/i18n';
import SpanForA from 'src/components/common/SpanForA';
const format = 'YYYY-MM-DD HH:mm:ss';

@connect((state) => {
  return {
    user: state.user.user,
  };
})
@injectLocale
export default class Index extends React.Component {
  handleJoinCompetition = (code, type) => {
    this.props
      .dispatch({
        type: 'activity/joinCompetition',
        payload: {
          code,
        },
      })
      .then(() => {
        message.success(_t('operation.succeed'));
      })
      .finally(() => {
        this.props.dispatch({
          type: 'activity/pullCompetiton',
          payload: {
            code,
            type,
          },
        });
      });
  };

  getStep = () => {
    const { user, activityData } = this.props;
    const {
      campaignResponse: { status },
      userAlreadyEnroll,
      isEnroll,
    } = activityData;
    if (status === ActivityStatus.WAIT_START) {
      return 0;
    }
    if (!user) {
      return 1;
    }
    if (!isEnroll) {
      return 6;
    }
    if (status === ActivityStatus.PROCESSING) {
      if (userAlreadyEnroll) {
        return 3;
      }
      return 2;
    }
    if (status === ActivityStatus.WAIT_REWARD || status === ActivityStatus.OVER) {
      if (userAlreadyEnroll) {
        return 3;
      }
      return 5;
    }
  };

  render() {
    const { startTime, item, activityData } = this.props;
    const { sign_up_condition } = item || {};
    const showCondition =
      activityData.isHoldCurrency ||
      activityData.isKyc ||
      activityData.isAgency ||
      activityData.isEnroll;
    if (!showCondition) {
      return null;
    }
    const step = this.getStep();
    const show = step !== 0 && step !== 1;
    const stepMap = {
      0: <span>{_t('activity.start.time.1', { time: showDatetime(startTime, format) })}</span>,
      1: <SpanForA data-key="login">{_t('login.required')}</SpanForA>,
      2: (
        <SpanForA
          className={style.join}
          onClick={() => {
            this.handleJoinCompetition(item.code, item.type);
          }}
        >
          {_t('participate')}
        </SpanForA>
      ),
      3: <span>{_t('participate.succeed')}😁</span>,
      5: <span>{_t('not.participate.tip')}</span>,
      6: null,
    };
    return (
      <div className={style.conditionBox}>
        <BaseComponent baseHead={_t('conditions')}>
          <div className={style.condition}>
            {activityData.isHoldCurrency && (
              <div className={style.conditionItem}>
                <p>{(sign_up_condition || {}).userIsHoldCurrency}</p>
                {show && (
                  <p>
                    <span className={activityData.userHoldCurrency ? style.success : style.fail}>
                      {activityData.userHoldCurrency ? (
                        _t('filled.conditions')
                      ) : (
                        <Link to="/assets/coin">{_t('missed.conditions')}</Link>
                      )}
                    </span>
                    <SvgIcon
                      iconId={activityData.userHoldCurrency ? 'sec-checked-fill' : 'sec-close-fill'}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </p>
                )}
              </div>
            )}
            {activityData.isKyc && (
              <div className={style.conditionItem}>
                <p>{(sign_up_condition || {}).userIsKyc}</p>
                {show && (
                  <p>
                    <span className={activityData.userKyc ? style.success : style.fail}>
                      {activityData.userKyc ? (
                        _t('filled.conditions')
                      ) : (
                        <Link to="/account/kyc">{_t('missed.conditions')}</Link>
                      )}
                    </span>
                    <SvgIcon
                      iconId={activityData.userKyc ? 'sec-checked-fill' : 'sec-close-fill'}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </p>
                )}
              </div>
            )}
            {activityData.isAgency && (
              <div className={style.conditionItem}>
                <p>{(sign_up_condition || {}).userIsAgency}</p>
                {show && (
                  <p>
                    <span className={activityData.userAgency ? style.success : style.fail}>
                      {activityData.userAgency ? (
                        _t('filled.conditions')
                      ) : (
                        <Link to="/account/kyc">{_t('missed.conditions')}</Link>
                      )}
                    </span>
                    <SvgIcon
                      iconId={activityData.userAgency ? 'sec-checked-fill' : 'sec-close-fill'}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </p>
                )}
              </div>
            )}
            <div className={style.conditionBtn}>{stepMap[step]}</div>
          </div>
        </BaseComponent>
      </div>
    );
  }
}
