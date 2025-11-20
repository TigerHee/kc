/**
 * Owner: jesse.shao@kupotech.com
 */
import styles from './styles.less';
import { useCallback } from 'react';
import { useSelector } from 'dva';
import { APPLICATION_VOTE } from 'config';
import { _t } from 'utils/lang';
import JsBridge from 'utils/jsBridge';

const Join = () => {
  const currentLang = useSelector(state => state.app.currentLang);
  const isInApp = useSelector(state => state.app.isInApp);
  const url = APPLICATION_VOTE[currentLang] || APPLICATION_VOTE.en_US;
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${url}`,
        }
      });
      return;
    }
    window.open(url, '_blank');
  }, [url, isInApp]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
      <a className={styles.btn} href={url} onClick={handleClick}>{_t('choice.join.btn')}</a>
      </div>
    </div>
  );
}

export default Join;
