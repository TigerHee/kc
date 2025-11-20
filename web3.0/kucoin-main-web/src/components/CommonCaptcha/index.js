/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import GeeTest from '../common/GeeTest';
import Recaptcha from 'react-recaptcha';
import ImageVer from './ImageVer';
import { Dialog } from '@kufox/mui';
import _ from 'lodash';
import { connect } from 'react-redux';
import { convertLang } from './langsConvert';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

const sitekey = GOOGLE_CAPTCHA_SITE_KEY; // eslint-disable-line

const callback = () => {
  console.log('Done!!!!');
};

// const verifyCallback = (response) => {
//   console.log(response);
// };

const expiredCallback = () => {
  console.log('Recaptcha expired');
};

let recaptchaInstance = null;

// !important 使用CommonCaptcha 需要引入 <script src="https://www.recaptcha.net/recaptcha/api.js?render=explicit" async defer /> ，不然无法初始化谷歌校验成功！！！

@connect((state) => {
  const { reCAPTCHA_time } = state.captcha;
  // const { currentLang } = state.app;
  return {
    reCAPTCHA_time,
    // currentLang,
  };
})
@injectLocale
export default class CommonCaptcha extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: true,
    };
    this.onSuccess = _.debounce(this.onSuccess.bind(this), 2000);
  }

  onSuccess = (validate) => {
    const { captchaType } = this.props;
    console.log('CommonCaptcha success', Date.now());
    this.props.onSuccess(validate, captchaType);
    // 重置人机验证
    if (recaptchaInstance && recaptchaInstance.reset) {
      recaptchaInstance.reset();
    }
    this.setState({
      showModal: false,
    });
  };

  switchModal = (showOrHide) => {
    this.setState({
      showModal: showOrHide,
    });
  };

  componentDidUpdate(preProps) {
    if (this.props.reCAPTCHA_time !== preProps.reCAPTCHA_time) {
      this.switchModal(true);
    }
  }

  render() {
    const { captchaType, currentLang } = this.props;

    const captchaTypeMap = {
      geetest: (
        <GeeTest
          product="bind"
          success={1}
          autoShow
          lang={convertLang(currentLang)}
          autoInit={false}
          biz={'commonCaptcha'} // 该属性在该模式下不生效
          onSuccess={this.onSuccess}
        />
      ),
      recaptcha: (
        <Recaptcha
          ref={(e) => {
            recaptchaInstance = e;
          }}
          className={style.recap}
          elementID="recaptcha"
          sitekey={sitekey}
          render="explicit"
          hl={currentLang}
          verifyCallback={this.onSuccess}
          onloadCallback={callback}
          expiredCallback={expiredCallback}
        />
      ),
      image: <ImageVer onSuccess={this.onSuccess} _t={_t} />,
    };
    if (captchaType === 'recaptcha') {
      return (
        <Dialog
          title={''}
          rootProps={{ className: style.modal }}
          footer={null}
          onCancel={() => this.switchModal(false)}
          open={this.state.showModal}
        >
          {captchaTypeMap[captchaType]}
        </Dialog>
      );
    }
    return <div className={style.commonCaptcha}>{captchaTypeMap[captchaType] || null}</div>;
  }
}
