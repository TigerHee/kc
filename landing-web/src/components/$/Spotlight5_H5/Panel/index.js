/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import Html from 'components/common/Html';
import ProjectTop from './ProjectTop';
import Social from './Social';
import CoinPrecision from 'components/common/CoinPrecision';
import { showDatetime } from 'helper';
import SuccessModal from './SuccessModal'
import { _t } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import { sensors } from 'utils/sensors';
import style from './style.less';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    qualification: state.spotlight5.qualification,
    reservationing: state.loading.effects['spotlight5/reservation'],
    isInApp: state.app.isInApp,
  };
})
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
  state={
    successVisible:false,
    failInfoVisible: false,
  }

  handleLogin = () => {
    const { dispatch, isInApp } = this.props;
    if (isInApp) {
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
      payload: { showLoginDrawer: true },
    });
  };

  handleReservation = () => {
    const { dispatch, rule = {} } = this.props;
    dispatch({
      type: 'spotlight5/reservation',
      payload: { 
        cb:(res)=>{
          if(res){
            this.showSuccseModal();
          }else{
            this.showFailInfo();
          }
        }
      },
    });
    sensors.trackClick(['participate', '1'], { coin: rule.currency });
  };

  // todo:点击滚动
  clickScroll = () => {
    window.scrollTo({
      top: document.getElementById('spotlight5-ProjectCondition').offsetTop,
      behavior: "smooth"
    });
    message.warning(_t('spotlight5.info.message'));
    const { rule = {} } = this.props;
    sensors.trackClick(['participate', '1'], { coin: rule.currency });
  }
  showSuccseModal=()=>{
    this.setState({
      successVisible: true
    })
  }
  hideSuccessModal=()=>{
    this.setState({
      successVisible: false
    })
  }
  showFailInfo=()=>{
    const _this = this;
    this.setState({
      failInfoVisible: true
    }, ()=>{
      setTimeout(()=>{
        _this.setState({
          failInfoVisible: false
        })
      },10000)
    })
  };
  render() {
    const {
      item, rule, isLogin, qualification, reservationing,
      isNewSpotlight6,
      isNewSpotlight8,
    } = this.props;
    const {successVisible, failInfoVisible} = this.state;
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
      successInfo
    } = rule;

    const {
      isCompletedKyc,
      // isInProcessing,
      isKycCountryInBlackList,
      isSignedAgreement,
      // 0-未预约，1-等待开奖，2-未中签，3-已中签
      status,
    } = qualification || {};
    const completedKyc = isNewSpotlight6 ? isCompletedKyc : true;

    const userPossible = completedKyc &&
      !isKycCountryInBlackList &&
      isSignedAgreement;

    const statusNotStart = processingStatus === 0;
    const statusProcessing = processingStatus === 1;
    const statusEnd = processingStatus === 2;

    let MethodButton = null;
    if (!isLogin) {
      // 未登录全部提示登录
      MethodButton = (
        <Button
          key="btn-login"
          type="primary"
          size="large"
          onClick={this.handleLogin}
        >
          {_t('spotlight.reservation.login')}
        </Button>
      );
    } else
      if (statusNotStart) {
        // 预约未开始
        MethodButton = (
          <Button key="btn-notstart" type="grey" disabled size="large">{_t('spotlight.reservation')}</Button>
        );
      } else if (!userPossible && !statusNotStart) {
        // 登录但没有资格或者预约未开始
        MethodButton = (
          <Button key="btn-notstart" type="primary" onClick={this.clickScroll} size="large">{_t('spotlight.reservation')}</Button>
        );
      } else
        if (statusProcessing && status === 0) {
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
        } else
          if (statusProcessing && status === 1) {
            // 等待开奖 并且 预约未结束
            MethodButton = (
              <Button key="btn-ok" type="success" size="large">{_t('spotlight.reservation.success')}</Button>
            );
          } else
            if (statusEnd && status === 1) {
              // 等待开奖 并且 预约结束
              MethodButton = (
                <Button disabled key="btn-wait" type="grey" size="large">
                  {isNewSpotlight8 ? 'Participated successfully' : _t('spotlight.lottery.wait')}</Button>
              );
            } else
              if (statusEnd && status === 3) {
                // 已中签
                MethodButton = (
                  <Button key="btn-success" type="warning" size="large">
                    {isNewSpotlight8 ? 'Participated successfully' : _t('spotlight.lottery.success')}</Button>
                );
              } else
                if (status === 0) {
                  // 未预约
                  MethodButton = (
                    <Button
                      disabled
                      key="btn-reservation-disable"
                      type="primary"
                      size="large"
                    >
                      {_t('spotlight.reservation')}
                    </Button>
                  );
                } else {
                  // 未中签
                  MethodButton = (
                    <Button disabled key="btn-failed" type="grey" size="large">
                      {isNewSpotlight8 ? 'Participated successfully' : _t('spotlight.lottery.failed')}</Button>
                  );
                }

    return (
      <div className={style.panel}>
        <div className={style.buyArea}>
          <ProjectTop
            title={item.page_title}
          />
          <div>
            <img src={item.image_url} className={style.logo} alt="logo" />
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
                      ) : '--'}
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
                      ) : '--'}
                    </div>
                  </div>
                </div>
                <div className={style.row}>
                  <div className={`${style.col} ${style.intro} ${style.single}`}>
                    <div className={style.title}>{_t('spotlight.lottery.time')}</div>
                    <div className={style.content}>
                      {showDatetime(lotteryTime, 'YYYY/MM/DD HH:mm')}
                      <span>UTC</span>
                    </div>
                  </div>
                </div>
                <div className={style.row}>
                  <div className={`${style.col} ${style.intro} ${style.single}`}>
                    <div className={style.title}>{_t('spotlight.reservation.time')}</div>
                    <div className={style.content}>
                      {showDatetime(startReservationTime, 'YYYY/MM/DD HH:mm')}
                      &nbsp;-&nbsp;
                      {showDatetime(endReservationTime, 'YYYY/MM/DD HH:mm')}
                      <span>UTC</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <img src={item.image_url} className={style.logo} alt="" /> */}
            </div>
            <div className={style.panelButton}>{MethodButton}</div>
            <Social
              iconMap={item.social_media}
              spotlink={item.spotlink}
              exchange_report_link={item.exchange_report_link}
              currency={currency}
            />
          </div>
        </div>
        <SuccessModal
          open={successVisible}
          size="small"
          onClose={this.hideSuccessModal}
          width="320px"
        >
          <Html>{ successInfo }</Html>
        </SuccessModal>
        {
          failInfoVisible && (
            <div className={style.failInfo}>
              <div>!</div>
              <span>Subscription failed, pleace try again.</span>
            </div>
          )
        }
      </div>
    );
  }
}
