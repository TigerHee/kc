/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SvgIcon from 'components/common/KCSvgIcon';
import SvgIconNoSSR from 'components/common/KCSvgIcon';
import { Button } from '@kc/ui';
import Social from './Social';
import ModalContent from './ModalContent';
import Records from '../Records';
import GradientCard from '../../../module/GradientCard';
// import CoinPrecision from 'components/common/CoinPrecision';
import CommonCaptcha from 'components/CommonCaptcha';
import TimeCountDownBox from 'components/common/TimeCountDownBox';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';
import SpanForA from 'src/components/common/SpanForA';
// const iconSize = {
//   width: 14,
//   height: 14,
//   marginRight: 6,
// };

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    securtyStatus: state.user.securtyStatus,
    bizType: state.distribute.bizType,
    rule: state.distribute.rule,
    qualification: state.distribute.qualification,
    REMAIN_SEC: state.distribute.REMAIN_SEC,
    captchaType: state.captcha.captchaType,
    isVerifing: state.loading.effects['distribute/verifyCode'],
    success: state.distribute.success,
    ordering: state.loading.effects['distribute/orderAndVerify'],
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

  constructor(props) {
    super(props);
    this.state = {
      showRecords: false,
      showTipsModal: false,
      modalState: 0,
      msg: '',
    };
  }

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

  handleSetShowTipsModal = (flag, status, msg = '') => {
    this.setState({ showTipsModal: flag, modalState: status, msg });
  };

  handleSetShowRecords = () => {
    this.setState({ showRecords: true });
  };

  handleSetHideRecords = () => {
    this.setState({ showRecords: false });
  };

  handleCountEnd = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'distribute/refreshRule' });
  };

  handleLogin = () => {
    push(`/ucenter/signin?back=${encodeURIComponent(window.location.href)}`);
  };

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
    this.handleSetShowTipsModal(true, 1);
    const {
      dispatch,
      rule: { currency },
    } = this.props;
    dispatch({
      type: 'captcha/update',
      payload: {
        captcha_enable: false,
        captcha_verify: false,
        captcha_config: null,
        captcha_ready: false,
        captcha_bizType: '',
        captchaType: '',
        imageTimestamp: '',
        imageVerVisible: false,
        imageSrc: null,
      },
    });
    dispatch({
      type: 'distribute/orderAndVerify',
      payload: {
        currency,
        captchaType,
        validate,
      },
    })
      .then((res) => {
        if (res.success) {
          this.handleSetShowTipsModal(true, 2);
        } else {
          this.handleSetShowTipsModal(true, 3, res ? res.msg : '');
        }
      })
      .catch((e) => {
        const { msg } = e;
        this.handleSetShowTipsModal(true, 3, msg);
      });
  };

  render() {
    const {
      item,
      rule,
      isLogin,
      qualification,
      success,
      ordering,
      // securtyStatus,
      // needCaptcha,
      // isVerifing,
    } = this.props;
    const { showTipsModal, showRecords, modalState, msg } = this.state;
    const {
      // startTime,
      processingStatus, // 活动进行状态，0未开始，1进行中，2已完成
      countDownSeconds,
      currency,
      quoteCurrency,
      // totalAmount,
      // campaignAmount,
      // unitAmount,
      // price,
      // maxUnitSize,
      // minUnitSize,
      stockAmount,
    } = rule;

    // const { WITHDRAW_PASSWORD } = securtyStatus || {};

    const statusNotStart = processingStatus === 0;
    const statusProcessing = processingStatus === 1;
    const statusEnd = processingStatus === 2;

    const canOrder = isLogin && qualification && qualification.isUnitSizeLeft;
    // const canOrder = true;
    let MethodButton = null;
    if (statusNotStart) {
      MethodButton = (
        <Button type="primary" size="large" onClick={this.handleBeginNotice}>
          {_t('spotlight.begin')}
        </Button>
      );
    } else if (statusEnd || +stockAmount === 0) {
      let tip = _t('spotlight.end');
      if (statusEnd) {
        tip = _t('spotlight.end');
      } else if (+stockAmount === 0 && canOrder === false) {
        tip = _t('spotlight.succeed');
      }

      MethodButton = (
        <Button disabled type="danger" size="large">
          {tip}
        </Button>
      );
    } else if (!isLogin) {
      // 未登录全部提示登录
      MethodButton = (
        <Button type="dashed" size="large" onClick={this.handleLogin}>
          {_t('spotlight.login')}
        </Button>
      );
    } else if (statusProcessing) {
      if (qualification) {
        MethodButton = (
          <Button
            key={'btn-processing'}
            type={!canOrder ? 'danger' : 'dashed'}
            size="large"
            disabled={ordering || success !== null || !canOrder}
            onClick={this.handleBeginCaptcha}
          >
            {_t(canOrder ? 'spotlight.buynow' : 'spotlight.succeed')}
          </Button>
        );
      } else {
        MethodButton = (
          <Button
            key={'btn-processing'}
            type={'dashed'}
            size="large"
            disabled={ordering || success !== null}
            onClick={this.handleBeginCaptcha}
          >
            {_t('spotlight.buynow')}
          </Button>
        );
      }
    } else {
      MethodButton = (
        <Button type="primary" size="large" onClick={this.handleBeginNotice}>
          {_t('spotlight.begin')}
        </Button>
      );
    }

    return (
      <div className={style.panel}>
        {!showRecords && (
          <GradientCard className={style.card}>
            <div className="pl-24 pr-24">
              <div className={style.info}>
                <div className={style.rows}>
                  <div className={style.row}>
                    <div className={style.col}>
                      <div className={style.title}>{_t('spotlight.price1')}</div>
                      <div className={style.content}>
                        {/* {price ? (
                        <React.Fragment>
                          <CoinPrecision value={price} coin={quoteCurrency} />
                          <span>{quoteCurrency}/{currency}</span>
                        </React.Fragment>
                      ) : _t('spotlight.will')} */}
                        <div className={style.intro}>{_t('spotlight.price.intro')}</div>
                      </div>
                    </div>
                  </div>
                  <div className={style.row}>
                    <div className={style.col}>
                      <div className={style.title}>{_t('spotlight.available.places')}</div>
                      <div className={style.content}>
                        {/* {unitAmount ? (
                        <React.Fragment>
                          <CoinPrecision value={unitAmount} coin={currency} />
                          <span >{currency}</span>
                        </React.Fragment>
                      ) : '--'} */}
                        <div className={style.intro}>500</div>
                      </div>
                    </div>
                  </div>
                  <div className={style.row}>
                    <div className={style.col}>
                      {/* <div className={style.title}>{_t('spotlight.total.amount')}</div> */}
                      <div className={style.title}>{_t('spotlight.discount')}</div>
                      <div className={style.content}>
                        {/* {totalAmount ? (
                        <React.Fragment>
                          <CoinPrecision value={totalAmount} coin={currency} />
                          <span>{currency}</span>
                        </React.Fragment>
                      ) : '--'} */}
                        <div className={style.intro}>{_t('spotlight.discount.intro')}</div>
                      </div>
                    </div>
                  </div>
                  <div className={style.row}>
                    <Social iconMap={item.social_media} currency={currency} />
                  </div>
                </div>
                <div className={style.rows} style={{ width: '430px', maxWidth: '430px' }}>
                  <div className={style.row} style={{ marginBottom: '5px' }}>
                    <span className={style.title}>{_t('spotlight.countdown')}</span>
                  </div>
                  <div className={style.row}>
                    <TimeCountDownBox
                      restSec={countDownSeconds < 0 ? 0 : countDownSeconds}
                      className={style.countdown}
                      numberBoxClassName={style.countdownBox}
                      handleCountEnd={this.handleCountEnd}
                      handleCountChange={this.handleCountChange}
                    />
                  </div>

                  <div className={`${style.col} ${style.intro} ${style.single}`}>
                    <div className={style.rowPanel}>
                      <div className={style.rowContainer}>
                        <div className={style.title}>{_t('spotlight.buy.intro')}</div>
                        <div className={style.title}>
                          {/* <a className={style.records} onClick={this.handleSetShowRecords}>
                          <SvgIcon iconId="records-blue-fill" style={iconSize} />
                          {_t('spotlight.buy.records')}
                        </a> */}
                        </div>
                      </div>
                      <div className={style.tipContent}>{item.introduction}</div>
                    </div>
                  </div>
                  <div className={style.panelButton}>{MethodButton}</div>
                </div>
              </div>
            </div>
          </GradientCard>
        )}
        {showRecords && (
          <div>
            <div className={style.back}>
              <SpanForA className={style.link} onClick={this.handleSetHideRecords}>
                <SvgIconNoSSR iconId="prev" />
                <span>{_t('back')}</span>
              </SpanForA>
            </div>
            <Records item={item} currency={currency} quoteCurrency={quoteCurrency} />
          </div>
        )}
        <ModalContent
          status={modalState}
          visible={showTipsModal}
          handleCloseModal={() => this.handleSetShowTipsModal(false, 0)}
          msg={msg}
          currency={currency}
          quoteCurrency={quoteCurrency}
        />
        <CommonCaptcha captchaType={this.props.captchaType} onSuccess={this.handleCaptchaSuccess} />
      </div>
    );
  }
}
