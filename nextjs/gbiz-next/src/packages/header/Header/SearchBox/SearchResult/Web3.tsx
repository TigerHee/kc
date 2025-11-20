/*
 * @Owner: elliott.su@kupotech.com
 */

import React, { useCallback, useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@kux/iconpack';
import { map, forEach, round } from 'lodash-es';
import { toPercent } from 'tools/math';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath'
import CoinIcon from '../../../components/CoinIcon';
import CoinTransferFold from '../../../components/CoinTransferFold';
import { defaultLimitNumber, pushHistory } from '../config';
import { useSiteConfig } from '../../siteConfig';
import { kcsensorsClick, kcsensorsManualTrack, shortenAddress } from '../../../common/tools';
import styles from './styles.module.scss';

export default props => {
  const { data, additional, inDrawer, lang, type, title } = props;

  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const { t } = useTranslation('header');
  const { KUCOIN_HOST } = useSiteConfig();

  const clickAdditional = useCallback((val, _clickAdditional) => {
    const { name, chainName, aveChainName, token } = val;
    const data = {
      type,
      showName: name,
      chainName: type === 'WEB3' ? chainName : aveChainName,
      token
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

  const percentNumber = useCallback(
    value => {
      if (typeof value !== 'number') {
        value = +value;
      }
      let color = 'var(--kux-text40)';
      let prefix = '';
      if (value > 0) {
        color = 'var(--kux-brandGreen)';
        prefix = '+';
      } else if (value < 0) {
        color = 'var(--kux-brandRed)';
      }
      return {
        prefix,
        color,
      };
    },
    []
  );

  useEffect(() => {
    if (data && data.length > 0) {
      forEach(data, item => {
        kcsensorsManualTrack(['NavigationSearchResult', '1'], {
          postType: 'web3',
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
        postType: 'web3',
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
          <span>{title}</span>
        </div>
        {map(data, (item, index) => {
          const { resourceExtend } = item;
          const { chainName, token, name, price, priceChangePercent24H: prt, icon, chainIcon, aveChainName } = resourceExtend;
          const chain = type === 'WEB3' ? chainName : aveChainName;
          const url = type === 'WEB3' ? addLangToPath(`${KUCOIN_HOST}/web3/swap?chain=${chain}&address=${token}`) : addLangToPath(`${KUCOIN_HOST}/trade/alpha/${chain}/${token}`);
          const { prefix, color } = percentNumber(prt);
          const prtStr = prt ? `${toPercent(round(prt, 4), lang)}` : '--';
          // id, invertCurrency
          if (index < limitNumber) {
            const _clickAdditional = {
              postType: 'web3',
              postId: item.resourceId,
              trade_pair: item.resourceId,
              groupId: additional.searchSessionId,
              contentItem: additional.searchWords,
              pagecate: 'NavigationSearchResult',
            };

            return (
              <a
                key={item.resourceId}
                className={styles.item}
                href={url}
                style={{ padding: inDrawer ? '12px' : '12px 12px' }}
                onClick={() => clickAdditional(resourceExtend, _clickAdditional)}
              >
                <div className={styles.web3Title}>
                  <span className={styles.coins}>
                    <CoinIcon icon={icon} />
                    <img className={styles.smallCoinIcon} src={chainIcon} />
                  </span>
                  <div className={styles.nameWrapper}>
                    <span className={styles.itemTitleWrapper}>
                      <span className={styles.itemTitle}>{name}</span>
                      <span className={styles.tag}>{chain}</span>
                    </span>
                    <span className={styles.typeName}>{shortenAddress(token)}</span>
                  </div>
                </div>
                <div className={styles.contentWrapper}>
                  <span className={styles.priceWrapper}>
                    <CoinTransferFold value={price} />
                  </span>
                  <span className={styles.web3RateWrapper} style={{ color }}>
                    {prefix}
                    {prtStr}
                  </span>
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
