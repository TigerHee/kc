/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import resolvePublicPath from 'utils/resolvePublicPath';

// 来自: https://github.com/xlsdg/react-geetest
class Geetest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ins: null,
      script: null,
    };
  }

  componentDidMount() {
    this._init();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.challenge !== this.props.challenge;
  }

  componentDidUpdate() {
    this._init();
  }

  componentWillUnmount() {
    this._destroy();
  }

  _init() {
    if (window.initGeetest) {
      return this._ready();
    }

    const ds = document.createElement('script');
    ds.type = 'text/javascript';
    ds.async = true;
    ds.charset = 'utf-8';
    if (ds.readyState) {
      ds.onreadystatechange = () => {
        if (ds.readyState === 'loaded' || ds.readyState === 'complete') {
          ds.onreadystatechange = null;
          this._ready();
        }
      };
    } else {
      ds.onload = () => {
        ds.onload = null;
        this._ready();
      };
    }
    // ds.src = `${document.location.protocol}//static.geetest.com/static/tools/gt.js?_t=${(new Date()).getDay()}`;
    ds.src = `${resolvePublicPath()}static/geetest/gt.js?_t=${new Date().getDay()}`;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ds, s);

    this.setState({ script: ds });
  }

  _ready() {
    console.log('init gee');
    const { gt, challenge, https, product, lang, sandbox, width, success } = this.props;
    const { ins } = this.state;

    if (!window.initGeetest) {
      return;
    }

    if (ins) {
      return this._load(ins);
    }

    return window.initGeetest(
      {
        gt,
        challenge,
        offline: !success,
        new_captcha: true,
        https,
        product,
        lang,
        sandbox,
        width,
      },
      (geetest) => {
        this._load(geetest);

        this.setState({ ins: geetest });
      },
    );
  }

  _load(ins) {
    const { product, onLoad, onReady, onSuccess, onClose, onError } = this.props;

    if (product !== 'bind') {
      ins.appendTo(this.geeTestRef);
    }
    onLoad(ins);
    ins.onReady(onReady);
    ins.onSuccess(() => onSuccess(ins.getValidate()));
    ins.onClose(onClose);
    ins.onError(onError);
  }

  _destroy() {
    this.setState({
      ins: null,
      script: null,
    });
  }

  storeRef = (ref) => {
    this.geeTestRef = ref;
  };

  render() {
    const { challenge } = this.props;

    return <div ref={this.storeRef} key={challenge} />;
  }
}

Geetest.propTypes = {
  gt: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
  success: PropTypes.number.isRequired,
  https: PropTypes.bool,
  product: PropTypes.string,
  lang: PropTypes.string,
  sandbox: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLoad: PropTypes.func,
  onReady: PropTypes.func,
  onSuccess: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
};

Geetest.defaultProps = {
  https: true,
  product: 'float',
  lang: 'en',
  sandbox: false,
  onLoad: function onLoad() {},
  onReady: function onReady() {},
  onSuccess: function onSuccess() {},
  onClose: function onClose() {},
  onError: function onError() {},
};

export default Geetest;
