/**
 * Owner: sean.shi@kupotech.com
 */
import { bootConfig } from 'kc-next/boot';
import { useState } from 'react';
import useIsMobile from '../../../../../hooks/useIsMobile';
import { Trans } from 'tools/i18n';
import { useLang, useHtmlToReact } from '../../../../../hookTool';
import { useFormat } from '../../hooks/useFormat';
import { useInviteBenefits } from '../../store';
import EarnCard from '../EarnCard';
import styles from './index.module.scss';

export function Earn() {
  const { t: _t } = useLang();
  const taskList = useInviteBenefits().taskList;
  const { newCommerConfig, vipConfig } = { newCommerConfig: undefined, vipConfig: undefined } as any;
  const { formatNum } = useFormat();
  const [apr, updateApr] = useState(0 as any);
  const isH5 = useIsMobile();

  const { tempTask } = (taskList as any) || {};
  const subtitle = tempTask?.financialSubtitle;
  const { eles: subtitleReact } = useHtmlToReact({ html: subtitle || '' });
  const subtitleContent = subtitle ? (
    <span>{subtitleReact}</span>
  ) : (
    <Trans
      i18nKey="sA9Vj5MBpXucKDwHVhHBoB"
      ns="entrance"
      values={{
        apr,
        amount: formatNum(2500),
        currency: bootConfig._BASE_CURRENCY_,
      }}
      components={{
        span: <span className="highlight" />,
      }}
    />
  );
  if (!taskList) return null;
  return (
    <div className={styles.container}>
      <div className={styles.title}>{_t('1ePNq93SasLMDRk4j43SjX')}</div>
      <div className={styles.description}>{subtitleContent}</div>
      <div className={styles.earnCardWrapper} data-ish5={isH5}>
        <EarnCard
          className={styles.earnCard}
          title={_t('nkyi8QqBW2onwKFhZkFz6L')}
          showShadow
          subscrpiton={false}
          typeKey="financialNewcomerTaskInfo"
          bizKey="FINANCIAL_NEWCOMER"
          options={newCommerConfig}
          onUpdateApr={updateApr}
        />
        <EarnCard
          className={styles.earnCard}
          title={_t('9JuwzgA77ArLQzVYMmXV8h')}
          showShadow
          subscrpiton={false}
          typeKey="financialVipTaskInfo"
          bizKey="FINANCIAL_VIP"
          options={vipConfig}
        />
      </div>
    </div>
  );
}

export default Earn;
