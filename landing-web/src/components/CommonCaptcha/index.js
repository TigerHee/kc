/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';

import GeeTest from '../common/GeeTest';
import Recaptcha from 'react-recaptcha';
import ImageVer from './ImageVer';
import { Modal } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { convertLang } from './langsConvert';
import style from './style.less';

const callback = () => {
  console.log('Done!!!!');
};

const verifyCallback = (response) => {
  console.log(response);
};

const expiredCallback = () => {
  console.log('Recaptcha expired');
};

let recaptchaInstance = null;

@connect((state) => {
  const { reCAPTCHA_time } = state.captcha;
  const { currentLang } = state.app;
  return {
    reCAPTCHA_time,
    currentLang,
  };
})
export default class CommonCaptcha extends React.Component {


  constructor(props) {
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
      geetest: <GeeTest
        product="bind"
        success={1}
        autoShow
        lang={convertLang(currentLang)}
        autoInit={false}
        biz={'commonCaptcha'} // 该属性在该模式下不生效
        onSuccess={this.onSuccess}
      />,
      recaptcha: <Recaptcha
        ref={(e) => { recaptchaInstance = e; }}
        className={style.recap}
        elementID="recaptcha"
        // prod key
        sitekey={GOOGLE_CAPTCHA_SITE_KEY}
        // dev key
        // sitekey={GOOGLE_CAPTCHA_DEV_SITE_KEY}
        render="explicit"
        hl={currentLang}
        verifyCallback={this.onSuccess}
        onloadCallback={callback}
        expiredCallback={expiredCallback}
      />,
      image: <ImageVer onSuccess={this.onSuccess} />,
    };
    if (captchaType === 'recaptcha') {

      return (<Modal
        className={style.modal}
        footer={null}
        onCancel={() => this.switchModal(false)}
        visible={this.state.showModal}
      >
        {captchaTypeMap[captchaType]}
      </Modal>);
    }
    return (<div
      className={style.commonCaptcha}
    >
      {captchaTypeMap[captchaType] || null}
    </div>);
  }
}
