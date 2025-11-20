/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import style from './style.less';

export default class Index extends React.Component {
  render() {
    const { imgUrl } = this.props;
    return (
      <React.Fragment>
        <img alt="" className={style.bannerImg} src={imgUrl} />
      </React.Fragment>
    );
  }
}
