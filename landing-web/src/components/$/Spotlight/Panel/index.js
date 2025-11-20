/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import ProjectTop from './ProjectTop';
import BuyTip from './BuyTip';
import Social from './Social';
import BuyForm from './BuyForm';
import GradientCard from '../module/GradientCard';
import CoinPrecision from 'components/common/CoinPrecision';
import CommonCaptcha from 'components/CommonCaptcha';
import { showDatetime } from 'helper';
import { _t } from 'utils/lang';
import { MAINSITE_HOST } from 'utils/siteConfig';
import style from './style.less';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    securtyStatus: state.user.securtyStatus,
    needCaptcha: state.spotlight.needCaptcha,
    bizType: state.spotlight.bizType,
    REMAIN_SEC: state.spotlight.REMAIN_SEC,
    captchaType: state.captcha.captchaType,
    isVerifing: state.loading.effects['spotlight/verifyCode'],
    success: state.spotlight.success,
    ordering: state.loading.effects['spotlight/orderAndVerify'],
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

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     buyNum: this.getMinUnitSize(props),
  //     visibleBuyModal: false,
  //   };
  // }

  // componentDidUpdate(prevProps) {
  //   const { rule } = this.props;
  //   const { minUnitSize } = rule;

  //   if (minUnitSize !== prevProps.rule.minUnitSize) {
  //     this.setState({ // eslint-disable-line react/no-did-update-set-state
  //       buyNum: this.getMinUnitSize(this.props),
  //     });
  //   }
  // }

  // getMinUnitSize = (props) => {
  //   const { rule } = props;
  //   const { minUnitSize } = rule;
  //   return minUnitSize || 1;
  // }

  handleCountEnd = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'spotlight/refreshRule' });
    console.log('count end');
  };

  // handleCountChange = (sec) => {
  //   const { REMAIN_SEC } = this.props;
  //   if (sec === REMAIN_SEC) {
  //     // 倒计时到5min时，检查人机验证
  //     const { dispatch } = this.props;
  //     dispatch({ type: 'spotlight/checkValidate' });
  //   }
  // };

  // handleShowBuyModal = () => {
  //   this.setState({ visibleBuyModal: true });
  // };

  // handleCloseBuyModal = () => {
  //   this.setState({ visibleBuyModal: false });
  // };

  handleLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: { showLoginDrawer: true },
    });
  };

  // handleChangeBuyNum = (buyNum) => {
  //   const num = +buyNum;
  //   this.setState({ buyNum: (num || 0) });
  // };

  handleBeginNotice = _.debounce(() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/feed',
      payload: {
        type: 'message.info',
        message: _t('spotlight.begininfo'),
      },
    });
  }, 300);

  handleBeginCaptcha = () => {
    const { dispatch, bizType } = this.props;
    dispatch({
      type: 'captcha/captcha_init',
      payload: {
        bizType,
      },
    });
  };

  handleCaptchaSuccess = (validate, captchaType) => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'spotlight/verifyCode',
    //   payload: {
    //     captchaType,
    //     validate,
    //   },
    // });

    const { dispatch, rule: { currency } } = this.props;
    dispatch({
      type: 'spotlight/orderAndVerify',
      payload: {
        currency,
        captchaType,
        validate,
      },
    });
  };

  render() {
    const {
      item, rule, isLogin, qualification,
      securtyStatus, needCaptcha, isVerifing,
      isNewSpotlight7,
    } = this.props;
    const { success, ordering } = this.props;
    // const { visibleBuyModal, buyNum } = this.state;
    const {
      startTime,
      processingStatus, // 活动进行状态，0未开始，1进行中，2已完成
      countDownSeconds,
      currency,
      quoteCurrency,
      totalAmount,
      campaignAmount,
      price,
      maxUnitSize,
      minUnitSize,
    } = rule;

    const {
      isCompletedKyc,
      isInProcessing,
      isKycCountryInBlackList,
      isPossibleOrder,
      isSignedAgreement,
      isUnitSizeLeft,
      isOrderSuccessInSessionOne,
    } = qualification || {};

    const { WITHDRAW_PASSWORD } = securtyStatus || {};
    const userPossible = isCompletedKyc &&
      (isNewSpotlight7 || WITHDRAW_PASSWORD) &&
      !isKycCountryInBlackList &&
      isSignedAgreement;

    const statusNotStart = processingStatus === 0;
    const statusProcessing = processingStatus === 1;
    const statusEnd = processingStatus === 2;

    // const canOrder = isLogin && isPossibleOrder && statusProcessing && isUnitSizeLeft;

    let MethodButton = null;
    if (statusEnd) {
      // 结束
      MethodButton = <Button disabled type="grey" size="large">{_t('spotlight.end')}</Button>;
    } else
    if (!isLogin) {
      // 未登录全部提示登录
      MethodButton = (
        <Button type="primary" size="large" onClick={this.handleLogin}>{_t('spotlight.login')}</Button>
      );
    } else
    if (isOrderSuccessInSessionOne) {
      // 登录但第一次已经成功
      MethodButton = <Button disabled type="grey" size="large">{_t('spotlight.already')}</Button>;
    } else
    if (!userPossible) {
      // 登录但没有资格
      MethodButton = <Button disabled type="grey" size="large">{_t('spotlight.nocond')}</Button>;
    } else
    if (!isUnitSizeLeft) {
      // 无机会了
      MethodButton = (
        <Button
          disabled
          type="primary"
          size="large"
        >
          {_t('spotlight.nochance', { n: 1 })}
        </Button>
      );
    } else {
      MethodButton = (
        <Button
          key={statusProcessing ? 'btn-processing' : 'btn-notstart'}
          type="primary"
          size="large"
          disabled={ordering || (success !== null)}
          onClick={statusProcessing ?
            this.handleBeginCaptcha : this.handleBeginNotice}
        >
          {_t('spotlight.buynow')}
        </Button>
      );
    }
    // if (statusProcessing && needCaptcha === false) {
    //   const disableBuyNum = !(buyNum >= (minUnitSize || 1) && buyNum <= (maxUnitSize || 1));
    //   MethodButton = (
    //     <Button
    //       type="primary"
    //       size="large"
    //       disabled={disableBuyNum}
    //       onClick={this.handleShowBuyModal}
    //     >
    //       {_t('spotlight.buynow')}
    //     </Button>
    //   );
    // } else
    // if (statusNotStart && needCaptcha === false) {
    //   // 未开始
    //   MethodButton = (
    //     <Button
    //       type="warning"
    //       size="large"
    //       onClick={this.handleBeginNotice}
    //     >
    //       {_t('spotlight.begin')}
    //     </Button>
    //   );
    // } else
    // if (needCaptcha !== false) {
    //   // 需要人机验证
    //   MethodButton = (
    //     <React.Fragment>
    //       <Button
    //         type="danger"
    //         size="large"
    //         onClick={this.handleBeginCaptcha}
    //         loading={isVerifing}
    //       >
    //         {_t('spotlight.captcha')}
    //       </Button>
    //     </React.Fragment>
    //   );
    // }

    return (
      <div className={style.panel}>
        <GradientCard>
          <ProjectTop
            title={item.page_title}
            notStart={statusNotStart}
            restSec={countDownSeconds < 0 ? 0 : countDownSeconds}
            handleCountEnd={this.handleCountEnd}
            // handleCountChange={this.handleCountChange}
          />
          <div className="pl-24 pr-24">
            <div className={style.info}>
              <div className={style.rows}>
                <div className={style.row}>
                  <div className={style.col}>
                    <div className={style.title}>{_t('spotlight.price')}</div>
                    <div className={style.content}>
                      {price ? (
                        <React.Fragment>
                          <CoinPrecision value={price} coin={quoteCurrency} />
                          <span>{ quoteCurrency }</span>
                        </React.Fragment>
                      ) : _t('spotlight.will')}
                    </div>
                  </div>
                  <div className={style.col}>
                    <div className={style.title}>{_t('spotlight.amount')}</div>
                    <div className={style.content}>
                      {campaignAmount ? (
                        <React.Fragment>
                          <CoinPrecision value={campaignAmount} coin={currency} />
                          <span>{ currency }</span>
                        </React.Fragment>
                      ) : '--'}
                    </div>
                  </div>
                </div>
                <div className={style.row}>
                  <div className={style.col}>
                    <div className={style.title}>{_t('spotlight.begintime')}</div>
                    <div className={style.content}>
                      {showDatetime(startTime, 'YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <div className={style.col}>
                    <div className={style.title}>{_t('spotlight.totalamount')}</div>
                    <div className={style.content}>
                      {totalAmount ? (
                        <React.Fragment>
                          <CoinPrecision value={totalAmount} coin={currency} />
                          <span>{ currency }</span>
                        </React.Fragment>
                      ) : '--'}
                    </div>
                  </div>
                </div>
                <div className={style.row}>
                  {/*
                  <div className={`${style.col} ${style.intro} ${canOrder ? '' : style.single}`}> */}
                  <div className={`${style.col} ${style.intro} ${style.single}`}>
                    <div className={style.title}>{_t('spotlight.intro')}</div>
                    <div className={style.content}>{ item.introduction }</div>
                  </div>
                  {/* {canOrder && (
                    <div className={style.col}>
                      <div className={style.title}>{_t('spotlight.size')}</div>
                      <div className={style.content}>
                        <InputNumber
                          size="large"
                          className={style.input}
                          min={0}
                          max={maxUnitSize || undefined}
                          value={buyNum}
                          onChange={this.handleChangeBuyNum}
                        />
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
              <img src={item.image_url} className={style.logo} alt="logo" />
            </div>
            <div className={style.panelButton}>{ MethodButton }</div>
            <Social
              iconMap={item.social_media}
              spotlink={item.spotlink}
              currency={currency}
            />
          </div>
        </GradientCard>
        <BuyTip quotaCoin={quoteCurrency} />
        <BuyForm
          // buyNum={buyNum}
          rule={rule}
          isNewSpotlight7={isNewSpotlight7}
          // visible={visibleBuyModal}
          // handleCloseBuyModal={this.handleCloseBuyModal}
        />
        <CommonCaptcha
          captchaType={this.props.captchaType}
          onSuccess={this.handleCaptchaSuccess}
        />
      </div>
    );
  }
}
