/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import Anniversary from './Template/Anniversary';
import style from './style.less';

export default class Index extends React.Component {
  render() {
    return (
      <div className={style.activityPageWrapper}>
        <div className={style.fullPageContent}>
          <Anniversary />
        </div>
      </div>
    );
  }
}
