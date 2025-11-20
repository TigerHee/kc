/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { getCmsCdnHost, getTimeStampByLen } from 'helper';
@connect((state) => {
  const { currentLang } = state.app;
  return {
    lang: currentLang,
  };
})
export default class LoadCmsStyle extends React.Component {
  constructor(props) {
    super(props);
    this.links = {};
  }

  componentDidMount() {
    this.loadStyle(this.props.run);
  }

  componentDidUpdate(preprops) {
    if (preprops.lang !== this.props.lang) {
      this.loadStyle(this.props.run);
    }
  }

  componentWillUnmount() {
    Object.keys(this.links).forEach((v) => {
      if (this.links[v] && this.links[v].current) {
        this.links[v].current.remove();
      }
    });
  }

  renderHead = () => {
    return null;
  };

  loadStyle = async (cmpts) => {
    const { combine } = this.props;

    if (combine) {
      return;
    }

    const [cur, ...rest] = Array.isArray(cmpts) ? cmpts : [cmpts];
    // 替换成cdn 的host
    this._loadStyle(cur);
    if (rest.length && rest[0]) {
      this.loadStyle(rest);
    }
  };

  _loadStyle = async (cmpt) => {
    const { lang } = this.props;
    const t = getTimeStampByLen(-6);
    const cdnhost = getCmsCdnHost();
    const styleSrc = `${cdnhost}/c_${cmpt}_${lang}.css?t=${t}`;
    this.makeStyle(cmpt, styleSrc);
  };

  getComponentId = () => {
    return this.props.run;
  };

  makeStyle = (cmpt, src) => {
    const linkEle = document.createElement('link');
    linkEle.href = src;
    linkEle.rel = 'stylesheet';
    this.linkRef = linkEle;
    this.links[cmpt] = this.links[cmpt] || React.createRef();
    this.links[cmpt].current = linkEle;
    document.querySelector('head').append(linkEle);
  };

  render() {
    return null;
  }
}
