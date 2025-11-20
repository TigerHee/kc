/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'dva';
import JsBridge from 'utils/jsBridge';
import { _t } from 'src/utils/lang';
import RenderCMS from '../../RenderCMS';
import styles from './style.less';

const GuardPlan = React.memo(() => {
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);

  const linkUs = React.useCallback(
    () => {
      if (isInApp) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: '/help',
          },
        });
      } else {
        dispatch({
          type: 'app/openZendesk',
        });
      }
    },
    [isInApp],
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <RenderCMS run="com.guradian.userguard.desc" />
      </div>
      <div className={styles.btn} onClick={linkUs}>
        {_t('guardian.contactUs')}
      </div>
    </div>
  );
});

export default GuardPlan;
