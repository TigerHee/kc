/**
 * Owner: lori@kupotech.com
 */
import { useTheme } from '@kux/mui';
import React from 'react';
import processingImgDark from 'static/account/processing-new-dark.svg';
import processingImg from 'static/account/processing-new.svg';
import { _t } from '@/tools/i18n';
import styles from './styled.module.scss';

const Finish = React.memo(() => {
  // 等待人工审核
  const theme = useTheme();
  return (
    <div className={styles.finishWrapper} data-inspector="applyUnfreeze_wait">
      <img src={theme.currentTheme === 'light' ? processingImg : processingImgDark} alt="tipImg" />
      <div className={styles.statusTitle}>{_t('selfService2.result.wait')}</div>
      <div className={styles.warning}>
        1.{_t('application.submited.desc')}
        <br />
        2.{_t('security.24h.limit')}
      </div>
    </div>
  );
});

export default Finish;
