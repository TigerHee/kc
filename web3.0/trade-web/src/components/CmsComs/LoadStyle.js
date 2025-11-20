/**
 * Owner: borden@kupotech.com
 */
// import _ from 'lodash';

import React from 'react';
import { getCmsCdnHost } from 'helper';

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
      console.log('run update');
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
      const cdnhost = getCmsCdnHost();
    const styleSrc = `${cdnhost}/c_${cmpt}_${lang}.css?t=${t}`;
    this.makeStyle(cmpt, styleSrc);
  };

  getComponentId = () => {
    return this.props.run;
  };

  makeStyle = (cmpt, src) => {
    const flag = cmpt.replaceAll('.', '_');
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
