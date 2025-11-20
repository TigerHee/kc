/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@kux/iconpack';
import { map, forEach, round } from 'lodash-es';
import { toPercent } from 'tools/math';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath'
import CoinIcon from '../../../components/CoinIcon';
import { defaultLimitNumber, pushHistory, getEarnUrl } from '../config';
import { kcsensorsClick, kcsensorsManualTrack } from '../../../common/tools';
import styles from './styles.module.scss';

export default props => {
  const { data, additional, inDrawer, lang } = props;
  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const { t } = useTranslation('header');

  const clickAdditional = useCallback((val, _clickAdditional) => {
    const { id, invertCurrency, productCategory, name, productCategoryItemStr, webJumpUrl } = val;
    const data = {
      type: 'EARN',
      productId: id,
      invertCurrency,
      lendingCurrency: name,
      productCategory,
      showName: `${name} - ${productCategoryItemStr}`,
      webJumpUrl,
    };
    pushHistory(data);
    kcsensorsClick(['NavigationSearchTopSearch', '1'], _clickAdditional);
  }, []);

  const changeNumber = useCallback(
    e => {
      // 总数量
      const totalNumber = data.length;
      // 剩余适量
      const remainNumber = totalNumber - limitNumber;
      let targetNumber = limitNumber;
      if (remainNumber > 15) {
        targetNumber += 10;
      } else {
        targetNumber += remainNumber;
      }
      setLimitNumber(targetNumber);
      e.preventDefault();
      return false;
    },
    [limitNumber, data]
  );

  const packUp = useCallback(e => {
    setLimitNumber(defaultLimitNumber);
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      forEach(data, item => {
        kcsensorsManualTrack(['NavigationSearchResult', '1'], {
          postType: 'earn',
          postId: item.resourceId,
          trade_pair: item.resourceId,
          groupId: additional.searchSessionId,
          contentItem: additional.searchWords,
          pagecate: 'NavigationSearchResult',
        });
      });
    }
    if (data && data.length > 3) {
      kcsensorsManualTrack(['NavigationSearchMoreButton', '1'], {
        postType: 'earn',
        groupId: additional.searchSessionId,
        contentItem: additional.searchWords,
        pagecate: 'NavigationSearchMoreButton',
      });
    }
  }, [additional, data]);

  if (data && data.length > 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.title} style={{ padding: inDrawer ? '0px' : '0 12px' }}>
          <span>{t('ojYrMzQofE5RtTPXmyRi2u')}</span>
        </div>
        {map(data, (item, index) => {
          const { resourceExtend } = item;
          const { name, prt, maxPrt, minPrt, icon, id, invertCurrency, productCategory, productCategoryItemStr, webJumpUrl } =
            resourceExtend;
          let prtStr = prt ? `${toPercent(round(Number(prt / 100), 4), lang)}` : '--';
          // minPrt或者maxPrt同时存在，则展示范围
          if (minPrt && maxPrt) {
            prtStr = `${toPercent(round(Number(minPrt / 100), 4), lang)} - ${toPercent(
              round(Number(maxPrt / 100), 4),
              lang,
            )}`;
          }
          // id, invertCurrency
          if (index < limitNumber) {
            const _clickAdditional = {
              postType: 'earn',
              postId: item.resourceId,
              trade_pair: item.resourceId,
              groupId: additional.searchSessionId,
              contentItem: additional.searchWords,
              pagecate: 'NavigationSearchResult',
            };
            const url = addLangToPath(getEarnUrl({ webJumpUrl, productCategory }));
            return (
              <a
                key={item.id}
                className={styles.item}
                href={url}
                style={{ padding: inDrawer ? '12px' : '12px 12px' }}
                onClick={() => clickAdditional(resourceExtend, _clickAdditional)}
              >
                <div className={styles.earnTitle}>
                  <CoinIcon coin={item.onvertCurrency} icon={icon} />
                  <div className={styles.nameWrapper}>
                    <span className={styles.itemTitle}>{name}</span>
                    <span className={styles.typeName}>{productCategoryItemStr}</span>
                  </div>
                </div>
                <div className={styles.contentWrapper}>
                  <span className={styles.rateWrapper}> {prtStr}</span>
                  <span className={styles.tip}>{t('8HU9JHaf5vQXV2by9jScTd')}</span>
                </div>
              </a>
            );
          }
          return null;
        })}
        {data.length > 3 ? (
          limitNumber < data.length ? (
            <div
              className={styles.getMore}
              style={{ padding: inDrawer ? '8px 0px 0px' : '8px 12px 0px' }}
              onMouseDown={changeNumber}
            >
              <span>{`${t('iNZfQgokqiKoTmHFou5dyi')}(${data.length - limitNumber})`}</span>
              <ArrowDownIcon size={16} />
            </div>
          ) : (
            <div
              className={styles.getMore}
              style={{ padding: inDrawer ? '8px 0px 0px' : '8px 12px 0px' }}
              onMouseDown={packUp}
            >
              <span>{t('1UHjkjvY81upkuviX1m189')}</span>
              <ArrowUpIcon size={16} />
            </div>
          )
        ) : null}
      </div>
    );
  }
  return null;
};
