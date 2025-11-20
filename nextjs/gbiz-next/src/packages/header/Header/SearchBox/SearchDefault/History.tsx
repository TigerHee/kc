/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import { map } from 'lodash-es';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Trans, useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath'
import { DeleteIcon } from '@kux/iconpack';
import { getSymbolText } from '../../../../trade/futures';
import clsx from 'clsx';
import { changeHistorySort, getHistory, removeHistory, getEarnUrl } from '../config';
import { useSiteConfig } from '../../siteConfig';
import { useTenantConfig } from '../../../tenantConfig';

import { kcsensorsManualTrack, kcsensorsClick } from '../../../common/tools';
import styles from './styles.module.scss';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const TRADE_PATH = '/trade';

export default ({ inDrawer, lang }) => {
  const { t } = useTranslation('header');
  const tenantConfig = useTenantConfig();
  const [historyList, setHistoryList] = useState<any[]>([]);
  const { POOLX_HOST, KUCOIN_HOST } = useSiteConfig();

  const markHistory = useCallback(index => {
    changeHistorySort(index, 0);
    const history = getHistory();
    if (history) {
      setHistoryList(history);
    }
    kcsensorsClick(['NavigationSearchHistory', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchHistory',
    });
  }, []);
  const getUrl = useCallback(
    data => {
      let url = '';
      const { type, symbol, previewEnableShow, productId, invertCurrency, productCategory, webJumpUrl, chainName, token } = data;
      if (type === 'HOT') {
        url = `${TRADE_PATH}/${symbol}`;
        if (previewEnableShow) {
          url = `${KUCOIN_HOST}/markets/new-cryptocurrencies`;
        }
        return url;
      }
      if (type === 'SPOT') {
        url = `${TRADE_PATH}/${symbol}`;
        return url;
      }
      if (type === 'FUTURES') {
        url = `${tenantConfig.KUMEX_TRADE}/${symbol}`;
        return url;
      }
      if (type === 'EARN') {
        if (webJumpUrl) {
          return getEarnUrl({ webJumpUrl, productCategory });
        }
        // 兼容历史的搜索缓存，老的搜索没有webJumpUrl字段
        url = `${POOLX_HOST}?product_id=${productId}`;
        if (productCategory === 'DUAL') {
          url = `${POOLX_HOST}/dual?seriesName=${invertCurrency}`;
        }
        if (productCategory === 'B2C_LENDING') {
          url = `${KUCOIN_HOST}/margin/v2/lend`;
        }
        return url;
      }
      if (type === 'WEB3') {
        url = `${KUCOIN_HOST}/web3/swap?chain=${chainName}&address=${token}`;
        return url;
      }
      if (type === 'ALPHA') {
        url = `${KUCOIN_HOST}/trade/alpha/${chainName}/${token}`;
        return url;
      }
      return url;
    },
    [KUCOIN_HOST, tenantConfig.KUMEX_TRADE, POOLX_HOST]
  );

  const deleteHistory = useCallback(e => {
    removeHistory();
    setHistoryList([]);
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    const history = getHistory();
    if (history) {
      setHistoryList(history);
    }
    kcsensorsManualTrack(['NavigationSearchHistory', '1'], {
      pagecate: 'NavigationSearchHistory',
    });
  }, []);

  const getFuturesName = useCallback(contract => {
    const { symbolName } = getSymbolText(contract, false);
    return symbolName;
  }, []);

  const getName = useCallback(
    item => {
      const { showName, contract, type } = item;
      if (type !== 'FUTURES') {
        return showName;
      }
      return contract ? getFuturesName(contract) : showName;
    },
    [getFuturesName]
  );

  if (!historyList || historyList.length === 0) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.title, inDrawer && styles.titleInDrawer)}>
        <span>{t('uoiEqArDcdp7iHwnuFd2V4')}</span>
        <DeleteIcon
          onMouseDown={deleteHistory}
          size={20}
          color='var(--kux-icon40)'
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className={styles.content}>
        {map(historyList, (item, index) => {
          const jumpUrl = addLangToPath(getUrl(item));
          const showName = getName(item);
          return (
            // TODO 待确认是否少传了inDrawer参数，元组件 HistoryItem
            <a
              className={styles.historyItem}
              key={item.symbol}
              title={item.symbol}
              href={jumpUrl}
              onClick={() => markHistory(index)}
            >
              {showName}
            </a>
          );
        })}
      </div>
    </div>
  );
};
