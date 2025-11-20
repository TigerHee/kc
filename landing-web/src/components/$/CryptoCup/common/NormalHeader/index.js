/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo } from 'react';
import { useHistory, useSelector } from 'dva';
import classname from 'classname';

import styles from './style.less';

/**
 * NormalHeader
 * 普通的头部
 */
const NormalHeader = memo(props => {
  const { title = 'title', className, ...restProps } = props;
  const isInApp = useSelector(state => state.app.isInApp);
  const classNamePro = classname(isInApp ? styles.header : styles.header__noapp, className);

  const { goBack } = useHistory();

  const handleBack = () => {
    goBack();
  };

  return (
    <header {...restProps} className={classNamePro}>
      <div className={styles.header__bar}>
        <button className={styles.header__back} onClick={handleBack} aria-label="back"  />
        <span className={styles.header__title}>{title}</span>
      </div>
    </header>
  );
});

export default NormalHeader;
