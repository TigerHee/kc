/**
 * Owner: willen@kupotech.com
 */
// import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@kc/ui';
import ProjectTop from './ProjectTop';
import Social from './Social';
import GradientCard from '../../../module/GradientCard';
import CoinPrecision from 'components/common/CoinPrecision';
import { showDateTimeByZone } from 'helper';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    qualification: state.spotlight2.qualification,
    reservationing: state.loading.effects['spotlight2/reservation'],
  };
})
@injectLocale
export default class Panel extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    rule: PropTypes.object,
    qualification: PropTypes.object,
  };

  static defaultProps = {
    item: {},
    rule: {},
    qualification: {},
  };

  handleLogin = () => {
    push(`/ucenter/signin?back=${encodeURIComponent(window.location.href)}`);
  };

  handleReservation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'spotlight2/reservation',
    });
  };

  render() {
    const { item, rule, isLogin, qualification, reservationing } = this.props;
    const {
      campaignAmount,
      // countryCodeBlackList,
      currency,
      startReservationTime,
      endReservationTime,
      // startTime,
      // endTime,
      lotteryTime,
      processingStatus,
      totalAmount,
    } = rule;

    const {
      isCompletedKyc,
      // isInProcessing,
      isKycCountryInBlackList,
      isSignedAgreement,
      // 0-未预约，1-等待开奖，2-未中签，3-已中签
      status,
    } = qualification || {};

    const userPossible = isCompletedKyc && !isKycCountryInBlackList && isSignedAgreement;

    const statusNotStart = processingStatus === 0;
    const statusProcessing = processingStatus === 1;
    const statusEnd = processingStatus === 2;

    let MethodButton = null;
    if (!isLogin) {
      // 未登录全部提示登录
      MethodButton = (
        <Button key="btn-login" type="primary" size="large" onClick={this.handleLogin}>
          {_t('spotlight.reservation.login')}
        </Button>
      );
    } else if (!userPossible || statusNotStart) {
      // 登录但没有资格或者预约未开始
      MethodButton = (
        <Button key="btn-notstart" disabled type="grey" size="large">
          {_t('spotlight.reservation')}
        </Button>
      );
    } else if (statusProcessing && status === 0) {
      // 未预约 并且 预约未结束
      MethodButton = (
        <Button
          key="btn-reservation"
          type="primary"
          size="large"
          loading={reservationing}
          onClick={this.handleReservation}
        >
          {_t('spotlight.reservation')}
        </Button>
      );
    } else if (statusProcessing && status === 1) {
      // 等待开奖 并且 预约未结束
      MethodButton = (
        <Button key="btn-ok" type="success" size="large">
          {_t('spotlight.reservation.success')}
        </Button>
      );
    } else if (statusEnd && status === 1) {
      // 等待开奖 并且 预约结束
      MethodButton = (
        <Button disabled key="btn-wait" type="gray" size="large">
          {_t('spotlight.lottery.wait')}
        </Button>
      );
    } else if (statusEnd && status === 3) {
      // 已中签
      MethodButton = (
        <Button key="btn-success" type="warning" size="large">
          {_t('spotlight.lottery.success')}
        </Button>
      );
    } else if (status === 0) {
      // 未预约
      MethodButton = (
        <Button disabled key="btn-reservation-disable" type="primary" size="large">
          {_t('spotlight.reservation')}
        </Button>
      );
    } else {
      // 未中签
      MethodButton = (
        <Button disabled key="btn-failed" type="gray" size="large">
          {_t('spotlight.lottery.failed')}
        </Button>
      );
    }

    return (
      <div className={style.panel}>
        <GradientCard>
          <ProjectTop title={item.page_title} />
          <div className="pl-24 pr-24">
            <div className={style.info}>
              <div className={style.rows}>
                <div className={style.row}>
                  <div className={style.col}>
                    <div className={style.title}>{_t('spotlight.totalamount')}</div>
                    <div className={style.content}>
                      {totalAmount ? (
                        <React.Fragment>
                          <CoinPrecision value={totalAmount} coin={currency} />
                          <span>{currency}</span>
                        </React.Fragment>
                      ) : (
                        '--'
                      )}
                    </div>
                  </div>
                  <div className={style.col}>
                    <div className={style.title}>{_t('spotlight.amount')}</div>
                    <div className={style.content}>
                      {campaignAmount ? (
                        <React.Fragment>
                          <CoinPrecision value={campaignAmount} coin={currency} />
                          <span>{currency}</span>
                        </React.Fragment>
                      ) : (
                        '--'
                      )}
                    </div>
                  </div>
                </div>
                <div className={style.row}>
                  <div className={`${style.col} ${style.intro} ${style.single}`}>
                    <div className={style.title}>{_t('spotlight.lottery.time')}</div>
                    <div className={style.content}>
                      {showDateTimeByZone(lotteryTime, 'YYYY/MM/DD HH:mm')}
                      <span>UTC+8</span>
                    </div>
                  </div>
                </div>
                <div className={style.row}>
                  <div className={`${style.col} ${style.intro} ${style.single}`}>
                    <div className={style.title}>{_t('spotlight.reservation.time')}</div>
                    <div className={style.content}>
                      {showDateTimeByZone(startReservationTime, 'YYYY/MM/DD HH:mm')}
                      &nbsp;-&nbsp;
                      {showDateTimeByZone(endReservationTime, 'YYYY/MM/DD HH:mm')}
                      <span>UTC+8</span>
                    </div>
                  </div>
                </div>
              </div>
              <img alt="" src={item.image_url} className={style.logo} />
            </div>
            <div className={style.panelButton}>{MethodButton}</div>
            <Social
              iconMap={item.social_media}
              spotlink={item.spotlink}
              exchange_report_link={item.exchange_report_link}
              currency={currency}
            />
          </div>
        </GradientCard>
      </div>
    );
  }
}
