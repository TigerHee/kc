/**
 * Owner: sean.shi@kupotech.com
 */
import { Trans } from 'tools/i18n';
import { memo, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { bootConfig } from 'kc-next/boot';
import { useLang, useHtmlToReact } from '../../../../../hookTool';
import useEarnDetailInfo from '../../hooks/useEarnDetailInfo';
import useEarnTask from '../../hooks/useEarnTask';
import { useFormat } from '../../hooks/useFormat';
import { add, divide } from '../../../../../common/tools';
import styles from './index.module.scss';

const BuyInfo = ({ earnInfo, className = '', nFormatterK, showTotal, _t }: any) => {
  const { currentBoughtAmount, maxBoughtAmount } = earnInfo || {};
  return (
    <div className={className}>
      <div className={styles.infoWrapper}>
        <span className={styles.infoItem}>
          {_t('6XjkKLxbn47BF7PV97Kqag', { amount: nFormatterK(currentBoughtAmount || 0, 2), currency: bootConfig._BASE_CURRENCY_ })}
        </span>
        {showTotal && (
          <span className={`${styles.infoItem} ${styles.dark}`}>
            {_t('fLXXHtmmwzgFvZXQYr2jgY')} {nFormatterK(maxBoughtAmount || 0, 2)} {bootConfig._BASE_CURRENCY_}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(({ typeKey, title, showShadow, subscrpiton = true, options, onUpdateApr, className = '', }: any) => {
  const { t: _t } = useLang();
  const { earnInfo, isBuyed, isActivityEnd } = useEarnTask(typeKey);
  const { formatNum, nFormatterK } = useFormat();

  const financialProductId = (earnInfo as any)?.financialProductId;
  const earnDetailInfo = useEarnDetailInfo(financialProductId);
  const { duration, apr, user_lower_limit, user_upper_limit } = (earnDetailInfo as any) || {};

  const totalApr = useMemo(() => {
    return add(0, apr || 0).toFixed();
  }, [apr]);

  useEffect(() => {
    if (totalApr && onUpdateApr) onUpdateApr(totalApr);
  }, [totalApr, onUpdateApr]);

  const { eles: subtitleReact } = useHtmlToReact({ html: (options as any)?.financialBenefitSubTitle || '' });
  console.log('earnDetailInfo..', typeKey, financialProductId, earnDetailInfo);
  if (!earnDetailInfo) return null;
  const aprDetail = subtitleReact;
  return (
    <section className={clsx(styles.wrapper, className, showShadow && styles.showShadow)}>
      <h5 className={styles.title}>
        {title}
        <span className={styles.desc}>
          {_t('77B7MWfWSmTiyeY4LXUrDV', { days: formatNum(duration || 0) })}
        </span>
      </h5>
      <div className={styles.descRow}>
        <div className={styles.descItem}>
          <span className={styles.descTitle}>
            {_t('4dmcz1DXPU8W83HzZu3pEB', { days: formatNum(duration || 0) })}
          </span>
          <div className={styles.detail}>
            <span className={styles.percent}>
              {formatNum(divide(totalApr, 100), { style: 'percent', _ignoreFractionDigits: true, minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            {aprDetail && <span className={styles.tag}>{aprDetail}<span className={styles.arrow} /></span>}
          </div>
        </div>
        {subscrpiton && (
          <div className={clsx(styles.descItem, styles.subscrpiton)}>
            <span className={clsx(styles.descTitle, styles.subscrpiton)}>
              {_t('64x3gkMmxDxnxwkR3kjace')}
            </span>
            <div className={styles.subDetail}>
              {formatNum(user_lower_limit || 0)} {bootConfig._BASE_CURRENCY_}
            </div>
          </div>
        )}
      </div>
      <div className={styles.holder} />
      <div className={styles.operation} data-activity-end={isActivityEnd}>
        {isBuyed ? (
          <BuyInfo _t={_t} showTotal={false} earnInfo={earnInfo} className={styles.leftContent} nFormatterK={nFormatterK} />
        ) : (
          <div className={clsx(styles.descText, styles.leftContent)}>
            <Trans
              i18nKey="aZgprFYtPiMgT4M4ioj4R9"
              ns="entrance"
              values={{ num1: formatNum(user_lower_limit || 0), num2: nFormatterK(user_upper_limit || 0), amount: nFormatterK(user_upper_limit || 0), currency: bootConfig._BASE_CURRENCY_ }}
              components={{ br: <br />, span: <span className={styles.amount} /> }}
            />
          </div>
        )}
      </div>
    </section>
  );
});


