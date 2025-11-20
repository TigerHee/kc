/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import { map } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Trans } from '@tools/i18n';
import { ICDeleteOutlined } from '@kux/icons';
import { useTheme } from '@kux/mui';
import { getSymbolText } from '@packages/trade/lib/futures';
import { Wrapper, Title, Content, HistoryItem } from './styled';
import { changeHistorySort, getHistory, removeHistory, getEarnUrl } from '../config';
import siteConfig from '../../siteConfig';
import { useLang } from '../../../hookTool';
import { kcsensorsManualTrack, kcsensorsClick, addLangToPath } from '../../../common/tools';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const TRADE_PATH = '/trade';

export default ({ inDrawer, lang }) => {
  const theme = useTheme();
  const { t } = useLang();
  const [historyList, setHistoryList] = useState();
  const { POOLX_HOST, KUCOIN_HOST, KUMEX_TRADE } = siteConfig;

  const markHistory = useCallback((index) => {
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
    (data) => {
      let url = '';
      const {
        type,
        symbol,
        previewEnableShow,
        productId,
        invertCurrency,
        productCategory,
        webJumpUrl,
      } = data;
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
        url = `${KUMEX_TRADE}/${symbol}`;
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
      return url;
    },
    [KUCOIN_HOST, KUMEX_TRADE, POOLX_HOST],
  );

  const deleteHistory = useCallback((e) => {
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

  const getName = useCallback(
    (item) => {
      const { showName, contract, type } = item;
      if (type !== 'FUTURES') {
        return showName;
      }
      return contract ? getFuturesName(contract) : showName;
    },
    [getFuturesName],
  );

  const getFuturesName = useCallback((contract) => {
    const { symbolName } = getSymbolText(contract);
    return symbolName;
  }, []);

  if (!historyList || historyList.length === 0) {
    return null;
  }
  return (
    <Wrapper>
      <Title inDrawer={inDrawer}>
        <span>{t('uoiEqArDcdp7iHwnuFd2V4')}</span>
        <ICDeleteOutlined
          onMouseDown={deleteHistory}
          size={20}
          color={theme.colors.icon}
          style={{ cursor: 'pointer' }}
        />
      </Title>
      <Content>
        {map(historyList, (item, index) => {
          const jumpUrl = addLangToPath(getUrl(item), lang);
          const showName = getName(item);
          return (
            <HistoryItem key={item.symbol} href={jumpUrl} onClick={() => markHistory(index)}>
              {showName}
            </HistoryItem>
          );
        })}
      </Content>
    </Wrapper>
  );
};
