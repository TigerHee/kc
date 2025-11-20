/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import style from './style.less';
import foxWarn from 'assets/spotlight/fox-warn.svg';

export default class Blocked extends React.Component {
  render() {
    return (
      <div className={style.blocked}>
        <img src={foxWarn} alt="" />
        <div className={style.content}>
          {_t('spotlight.country_limit')}
        </div>
      </div>
    );
  }
}
