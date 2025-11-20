/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { _t } from 'src/utils/lang';
import { sensors } from 'src/utils/sensors';
import {
  CurrencyWrapper,
  FlexRow,
  CurrencyName,
  CurrencyLinks,
  FlexColumn,
  ChangeRate,
  Price,
  LinkDivider,
  ChangeWrapper,
} from './StyledComps';
import { useIsMobile } from 'src/components/Responsive';
import { multiply, openPage } from 'src/helper';
import { TRADE_URL } from './config';

const getChangeRatePrefix = value => {
  if (value > 0) return '+';
  return '';
};

const CurrencyItem = ({ item }) => {
  const symbolMap = useSelector(state => state.lunc.symbolMap || {});
  const isInApp = useSelector(state => state.app.isInApp);
  const { symbol, ifContract, contractSymbol } = item || {};
  const info = symbolMap[symbol] || {};
  const [base, quote] = symbol.split('-');
  const isMobile = useIsMobile();
  const goToPage = useCallback(
    debounce(
      (type, target, evt) => {
        evt.preventDefault();
        // 埋点
        sensors.trackClick([`${type}`, '1']);
        const urlObj = TRADE_URL[type.toUpperCase()];
        let url;
        if (isInApp) {
          url = urlObj?.appUrl;
        } else if (isMobile) {
          url = urlObj?.h5Url;
        } else {
          url = urlObj?.pcUrl;
        }
        // 跳转
        if (url) {
          openPage(isInApp, `${url}${target}`);
        }
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [isInApp, isMobile],
  );
  return (
    <CurrencyWrapper>
      <FlexRow>
        <CurrencyName>
          <span>{base}</span>
          <span>{`/ ${quote}`}</span>
        </CurrencyName>
        <CurrencyLinks>
          <a href='#Spot' onClick={(e) => goToPage('Spot', symbol, e)}>{_t('xmD9RUBH8VVYyi81ESXCGf')}</a>
          <>
            {!!ifContract && (
              <>
                <LinkDivider type="vertical" />
                <a href='#Futures' onClick={(e) => goToPage('Futures', contractSymbol, e)}>
                  {_t('uRU6sYRQ262QMi5jWwdXHy')}
                </a>
              </>
            )}
          </>
        </CurrencyLinks>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <span>{_t('kZJAFrTepAu8i2NjeVihbo')}</span>
          <Price>{info.price || 0}</Price>
        </FlexColumn>
        <FlexColumn style={{ alignItems: 'end' }}>
          <span>{`24${_t('2KfXHkYNm2ZsRmCHh2t1rE').toLowerCase()}/${_t(
            '7EsLay8nJyK2kucqZGN3Tr',
          )}`}</span>
          <ChangeWrapper>
            <ChangeRate value={info.priceChangeRate24h || 0}>
              {`${getChangeRatePrefix(info.priceChangeRate24h)}${multiply(
                info.priceChangeRate24h || 0,
                100,
                2,
              )}%`}
            </ChangeRate>
            <ChangeRate value={info.priceChangeRate7d || 0}>
              {`(${getChangeRatePrefix(info.priceChangeRate7d)}${multiply(
                info.priceChangeRate7d || 0,
                100,
                2,
              )}%)`}
            </ChangeRate>
          </ChangeWrapper>
        </FlexColumn>
      </FlexRow>
    </CurrencyWrapper>
  );
};

export default CurrencyItem;
