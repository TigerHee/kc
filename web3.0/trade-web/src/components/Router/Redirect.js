/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { siteCfg } from 'config';
import { addLangToPath } from 'utils/lang';

const { MAINSITE_HOST } = siteCfg;

export default class Redirect extends React.Component {
  componentDidMount() {
    const { to } = this.props;
    let goto = to;
    if (goto && goto.indexOf('/') === 0) {
      goto = addLangToPath(`${MAINSITE_HOST}${goto}`);
    }
    window.location.href = goto;
  }
  render() {
    return null;
  }
}
