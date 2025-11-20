import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'tools/i18n';
import { Trans } from 'tools/i18n';
import commonStyles from '../styles.module.scss';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';
import { getTenantConfig } from '../../tenantConfig';

export default function Whistleblower() {
  const { t } = useTranslation('footer');
  const tenantConfig = getTenantConfig(bootConfig._BRAND_SITE_);

  return (
    <dd
      className={clsx(commonStyles.newFooterHover, 'newFooterHover')}
      data-inspector="inspector_footer_Whistleblower"
    >
      <span style={{ padding: '4px 0 !important', display: 'inline-block' }}>
        {t('bZMWZGPy2x9wj5DcBZrK8F')}
      </span>
      <section
        className={clsx(commonStyles.newFooterHoverMenu, styles.tipOffMenu, 'newFooterHoverMenu', 'tipOffMenu')}
        data-inspector="inspector_footer_Whistleblower_children"
      >
        <h4 className={clsx(styles.tipOffMenuTitle, 'tipOffMenuTitle')}>
          {t('sDbPTgLT7QGMB98z9wx2mS')}
        </h4>
        <ol className={styles.ol}>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('wUdMNPE5z95BXX7Rk2BBCk')}
          </li>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('4cDGVqYyRpReHGPohUaALn')}
          </li>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('azNUD4jMbQgfAx9rd2sAEv')}
          </li>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('eWa64H5uyCLcziSxe2vdag')}
          </li>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('nExX7SCrWwpFnVmRhzNoMe')}
          </li>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('9ZTt4FN8zv9inucjZ8qvYr')}
          </li>
          <li className={clsx(styles.tipOffMenuItem, 'tipOffMenuItem')}>
            {t('iaqRMs87HVN2jVqGmB7tPy')}
          </li>
        </ol>
        <p
          className={clsx(styles.tipOffMenuItem, styles.tipOffMenuTip, 'tipOffMenuItem', 'tipOffMenuTip')}
        >
          {t('k9Z4VAFxRpoTv5NAJ48V3U')}
        </p>
        <p className={clsx(styles.tipOffMenuMail, 'tipOffMenuMail')}>
          <Trans
            i18nKey="gq4xUyim65HHE3swndoYW5"
            ns="footer"
            values={{ email: tenantConfig.email }}
          >
            舉報郵箱：
            <a target="_blank" rel="noopener noreferrer nofollow" href={`mailto:${tenantConfig.email}`}>
              email
            </a>
          </Trans>
        </p>
      </section>
    </dd>
  );
}
