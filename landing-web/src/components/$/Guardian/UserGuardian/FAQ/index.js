/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import RenderCMS from '../../RenderCMS';
import styles from './style.less';
import { _t } from 'src/utils/lang';

const FAQ = React.memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{_t('activity.questions.title')}</div>
      <RenderCMS run="com.guradian.faq" />
    </div>
  );
});

export default FAQ;