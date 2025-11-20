/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { siteCfg } from 'config';
import { getUtmLink } from 'utils/getUtm';
import { addLangToPath } from 'utils/lang';
import { WITHOUT_QUERY_PARAM } from 'codes';

const { MAINSITE_HOST } = siteCfg;

@connect((state) => {
  return {
    currentLang: state.app.currentLang,
  };
})
export default class Link extends React.PureComponent {
  handleClick = (e) => {
    const { onClick } = this.props;
    // console.log(e, 'e');

    if (typeof onClick === 'function') {
      // e.preventDefault();
      onClick(e);
    }
  };

  getHrefProps = () => {
    const { href, to, currentLang } = this.props;
    let goto = href || to;

    if (goto && typeof goto === 'string' && goto.indexOf('/') === 0) {
      if (goto === '/') {
        goto = getUtmLink(MAINSITE_HOST || '', WITHOUT_QUERY_PARAM);
      } else {
        goto = getUtmLink(`${MAINSITE_HOST}${goto}`, WITHOUT_QUERY_PARAM);
      }
    }
    return addLangToPath(goto);
  };

  render() {
    const { dispatch, children, href, to, onClick, currentLang, ...otherProps } = this.props; // eslint-disable-line no-unused-vars
    const _href = this.getHrefProps();
    return (
      <a href={_href} onClick={this.handleClick} {...otherProps}>
        {children}
      </a>
    );
  }
}
