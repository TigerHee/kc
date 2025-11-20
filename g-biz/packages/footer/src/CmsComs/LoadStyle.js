/**
 * Owner: iron@kupotech.com
 */

import React from 'react';
import { getCmsCdnHost } from './config';

export default class LoadCmsStyle extends React.Component {
  constructor(props) {
    super(props);
    this.links = {};
  }

  componentDidMount() {
    this.loadStyle(this.props.run);
  }

  componentDidUpdate(preprops) {
    if (this.props.lang && preprops.lang !== this.props.lang) {
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
    const { combine, lang } = this.props;
    // 如果不是浏览器或没有语言，不加载
    if (combine || !lang || !window) {
      return;
    }
    const [cur, ...rest] = cmpts;
    // 替换成cdn 的host
    this._loadStyle(cur);
    if (rest.length && rest[0]) {
      this.loadStyle(rest);
    }
  };

  _loadStyle = async (cmpt) => {
    const { lang } = this.props;
    const t = Date.now()
      .toString()
      .slice(0, -6);
    const styleSrc = `${getCmsCdnHost()}/c_${cmpt}_${lang}.css?t=${t}`;
    this.makeStyle(cmpt, styleSrc);
  };

  getComponentId = () => {
    return this.props.run;
  };

  makeStyle = (cmpt, src) => {
    const flag = (cmpt || '').replace(/\./g, '_');
    const isExist = document.querySelector(`link[data-meta=${flag}]`);
    if (isExist) {
      return;
    }
    const linkEle = document.createElement('link');

    linkEle.href = src;
    linkEle.rel = 'stylesheet';
    linkEle.setAttribute('data-meta', flag);
    this.linkRef = linkEle;

    this.links[cmpt] = this.links[cmpt] || React.createRef();
    this.links[cmpt].current = linkEle;
    document.querySelector('head').append(linkEle);
  };

  render() {
    return null;
  }
}
