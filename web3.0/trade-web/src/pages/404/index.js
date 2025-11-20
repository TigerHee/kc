/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import Logo from 'components/Logo';
// import { _t } from 'src/initial';
import SafeLink from 'components/SafeLink';
import { gaExpose } from 'utils/ga';
import style from './style.less';

class NotFound extends React.Component {
  render() {
    return (
      <div className={style.not_found}>
        <div className={style.head}>
          <Logo />
          <p>404 Not Found</p>
        </div>
        <div className={style.content}>
          <div className={style.leftC}>
            <SafeLink isSelf href="/">Return Home</SafeLink>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    gaExpose('TEG_PAGE_404');
  }
}

export default NotFound;
