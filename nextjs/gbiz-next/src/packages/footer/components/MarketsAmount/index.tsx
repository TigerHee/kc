/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import useLang from 'hooks/useLang';
import { useTranslation } from 'tools/i18n';
import { useFooterStore } from 'packages/footer/model';
import { formatLangNumber } from 'packages/footer/common/tools';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';
import { getTenantConfig } from 'packages/footer/tenantConfig';

export default function MarketsAmount() {
  const { currentLang } = useLang();
  const { t } = useTranslation('footer');
  const summary = useFooterStore(store => store.summary);
  const tenantConfig = getTenantConfig(bootConfig._BRAND_SITE_);

  if (!summary || !summary.TRADING_VOLUME || tenantConfig.hideFooterBaseVolAmount) {
    return null;
  }
  const baseVolAmount = summary.TRADING_VOLUME.amount;

  return (
    <div className={styles.vol} data-inspector="inspector_footer_markets_amount">
      <span className={clsx('label', styles.label, styles.font)}>24h {t('deal.vol')}</span>
      {formatLangNumber(baseVolAmount, currentLang)}
      <span className={clsx('unit', styles.unit, styles.font)}>{bootConfig._BASE_CURRENCY_}</span>
    </div>
  );
}
