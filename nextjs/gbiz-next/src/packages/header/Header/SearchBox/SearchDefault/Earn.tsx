/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { map, round } from 'lodash-es';
import { toPercent } from 'tools/math';
import addLangToPath from 'tools/addLangToPath'
import CoinIcon from '../../../components/CoinIcon';
import { kcsensorsManualTrack, kcsensorsClick } from '../../../common/tools';
import { useTranslation } from 'tools/i18n';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { getEarnUrl } from '../config';

export default props => {
  const { data, inDrawer, lang } = props;
  const { t } = useTranslation('header');

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearchTopEarn', '1'], {
      pagecate: 'NavigationSearchTopEarn',
    });
  }, []);

  const markHistory = useCallback(index => {
    kcsensorsClick(['NavigationSearchTopEarn', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchTopEarn',
    });
  }, []);
  if (data && data.earn && data.earn.length > 0) {
    return (
      <div className={styles.wrapper}>
        <div className={clsx(styles.title, inDrawer && styles.titleInDrawer)}>
          <span>{t('iASDc954cNKzLNZMN9kKsf')}</span>
        </div>
        <div className={styles.content}>
          {map(data.earn, (item, index) => {
            const { id, invertCurrency, productCategory, name, icon, productCategoryItemStr, prt, minPrt, maxPrt, webJumpUrl } =
              item;
            let prtStr = prt ? `${toPercent(round(Number(prt / 100), 4), lang)}` : '--';
            // minPrt或者maxPrt同时存在，则展示范围
            if (minPrt && maxPrt) {
              prtStr = `${toPercent(round(Number(minPrt / 100), 4), lang)} - ${toPercent(
                round(Number(maxPrt / 100), 4),
                lang,
              )}`;
            }
            const url = addLangToPath(getEarnUrl({ webJumpUrl, productCategory }));
            if (index < 3) {
              return (
                <a className={styles.item} key={id} href={url} onClick={() => markHistory(index)}>
                  <div className={styles.earnTitle}>
                    <CoinIcon coin={invertCurrency} icon={icon} style={{ width: 20, height: 20, marginInlineEnd: 12 }} />
                    <div className={styles.nameWrapper}>
                      <span className={styles.itemTitle}>{name}</span>
                      <span className={styles.typeName}>{productCategoryItemStr}</span>
                    </div>
                  </div>
                  <div className={styles.contentWrapper}>
                    <span className={styles.rateWrapper}>{prtStr}</span>
                    <span className={styles.tip}>{t('8HU9JHaf5vQXV2by9jScTd')}</span>
                  </div>
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
  return null;
};
