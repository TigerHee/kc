/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BaseGeeTest from './BaseGeeTest';

@connect((state, props) => {
  const { captcha_config, captcha_verify, captcha_ready } = state[props.model || 'captcha'];
  return { config: captcha_config, verify: captcha_verify, ready: captcha_ready };
})
export default class GeeTest extends React.PureComponent {
  static propTypes = {
    product: PropTypes.string,
    onSuccess: PropTypes.func,
    model: PropTypes.string.isRequired, // model 的 namespace
  };

  static defaultProps = {
    product: 'bind',
    model: 'captcha',
    onSuccess() {},
  };
  constructor(props) {
    super(props);
    this.dispatchWrapper = this.dispatchWrapper.bind(this);
  }

  retry = 0;

  dispatchWrapper = (type, payload = {}, otherInfo = {}) => {
    const { dispatch, model } = this.props;

    // console.log('ddddd=>>>>', model, type, JSON.stringify(payload));
    return dispatch({
      type: `${model}/${type}`,
      payload,
      ...otherInfo,
    });
  }

  componentDidMount() {
    const { autoInit = true } = this.props;
    if (autoInit) {
      this._init();
    }
  }

  _init = () => {
    const { biz } = this.props;
    this.dispatchWrapper('captcha_start', {
      bizType: biz,
    });
  }

  componentDidUpdate(prevProps) {
    const { verify, ready, biz } = this.props;
    if (biz !== prevProps.biz) {
      this._init();
      return;
    }

    if (ready && !prevProps.verify && verify) {
      if (prevProps.product === 'bind' && this.captchaObj) {
        this.captchaObj.verify();
      }
    }
  }

  componentWillUnmount() {
    this.dispatchWrapper('captcha_clear');
  }

  handleLoad = (captchaObj) => {
    this.captchaObj = captchaObj;
  };

  handleClose = () => {
    // const { dispatch } = this.props;
    this.dispatchWrapper('captcha_clear', {}, { resetReady: false });
    // dispatch({ type: 'captcha/clear', resetReady: false });
  };

  handleSuccess = (validate) => {
    const { onSuccess } = this.props;
    this.dispatchWrapper('captcha_clear');

    onSuccess.call(null, validate);
  };

  handleReady = () => {
    const { autoShow = false } = this.props;
    this.dispatchWrapper('captcha_ready', {
      captcha_verify: autoShow,
    });
    // dispatch({ type: 'captcha/ready' });
  };

  handleError = () => {
    const { biz } = this.props;
    this.retry += 1;
    if (this.retry > 3) {
      window.location.reload();
    } else {
      this.dispatchWrapper('captcha_retry', {
        bizType: biz,
      });
    }
  };

  render() {
    const { config, ...options } = this.props;
    if (!config) {
      return null;
    }

    return (
      <BaseGeeTest
        {...options}
        {...config}
        onLoad={this.handleLoad}
        onReady={this.handleReady.bind(this)}
        onClose={this.handleClose}
        onSuccess={this.handleSuccess}
        onError={this.handleError}
      />
    );
  }
}
