/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from 'gbiz-next/bridge';
import { Button } from '@kux/mui';
import { addLangToPath, _t } from '@/tools/i18n';
import blockIcon from 'static/account/block.svg';
import styles from './Restriction.module.scss';

/**
 * 区域访问限制
 */
export default function RegionRestriction() {
  return (
    <div className={styles.customWrapper}>
      <img className={styles.icon} src={blockIcon} alt="region restriction" />
      <h1 className={styles.title}>{_t('4e34428473d84800a69f')}</h1>
      <Button
        className={styles.customButton}
        onClick={() => {
          const isApp = JsBridge.isApp();
          if (isApp) {
            JsBridge.open(
              {
                type: 'jump',
                params: { url: '/home' },
              },
              () => {
                JsBridge.open({
                  type: 'func',
                  params: { name: 'exit' },
                });
              },
            );
          } else {
            window.location.href = addLangToPath('/');
          }
        }}
      >
        {_t('88e7f39666664000a41f')}
      </Button>
    </div>
  );
}
