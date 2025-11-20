/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import _ from 'lodash';
import classname from 'classname';
import { Link } from 'components/Router';
import Responsive from 'components/Responsive';
import LangSelector from './LangSelector';
import { _t } from 'utils/lang';
import styles from './style.less';
// import logo from 'assets/logo.svg';

/**
 * @deprecated 此header不公用，不对外提供，每个land自己管理Header，公用可以使用KCHeader
 * @param {*} param0
 */
const Header = ({ pathname }) => {

  return (
    <div className={styles.affix}>
      <div className={styles.head}>
        <div className={styles.limit}>
          <div className={styles.headLeft}>
            <Link to="/" className={styles.logo}>
              {/* <img src={logo} alt="KuCoin" /> */}
            </Link>
          </div>
          <div className={styles.headRight}>
            <Responsive>
              <div className={styles.langSelect}>
                <LangSelector />
              </div>
            </Responsive>

            <Responsive.Mobile>
              <div className={styles.langSelectMb}>
                <LangSelector />
              </div>
            </Responsive.Mobile>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
