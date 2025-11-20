/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import clxs from 'classnames';
import { _t } from 'utils/lang';
import UserGuardian from '../UserGuardian';
import Project from '../Project';
import styles from './style.less';

const COMP = {
  partner: <Project />,
  user: <UserGuardian />,
};

const GuardTab = React.memo(() => {
  const [active, setActive] = React.useState('partner');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div
          inspector="partner_tab"
          className={clxs(styles.tab, { [styles.active]: active === 'partner' })}
          onClick={() => setActive('partner')}
        >
          <span className={styles.txt}>{_t('guardian.partners')}</span>
        </div>
        <div
          inspector="user_tab"
          className={clxs(styles.tab, { [styles.active]: active === 'user' })}
          onClick={() => setActive('user')}
        >
          <span className={styles.txt}>{_t('guardian.users')}</span>
        </div>
      </div>
      <div className={styles.content} inspector={`${active}-content`}>
        {COMP[active]}
      </div>
    </div>
  );
});

export default GuardTab;
