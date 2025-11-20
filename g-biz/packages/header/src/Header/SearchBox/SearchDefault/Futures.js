/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { map } from 'lodash';
import { styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { useCompliantShow } from '@packages/compliantCenter';
import { useLang } from '../../../hookTool';
import PriceRate from './PriceRate';
import FutureSymbolText from '../../../components/FutureSymbolText';
import { Wrapper, Title, Content, SymbolItem, H5Content, H5SymbolItem } from './styled';
import { namespace } from '../../model';
import siteConfig from '../../siteConfig';
import { kcsensorsManualTrack, kcsensorsClick, addLangToPath } from '../../../common/tools';
import { SEARCH_FUTURE_ENTRANCE_FUTURE_SPM } from '../../config';

const CodeName = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 18px;
  margin-bottom: 4px;
`;

export default (props) => {
  const { data, inDrawer, lang } = props;
  const { t } = useLang();
  const { KUMEX_TRADE } = siteConfig;
  const { futuresSymbols } = useSelector((state) => state[namespace] || {});

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearchTopFutures', '1'], {
      pagecate: 'NavigationSearchTopFutures',
    });
  }, []);

  const markHistory = useCallback((index) => {
    kcsensorsClick(['NavigationSearchTopFutures', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchTopFutures',
    });
  }, []);

  // 使用spmid判断(如英国ip隐藏合约搜索结果)
  const showSearchFuture = useCompliantShow(SEARCH_FUTURE_ENTRANCE_FUTURE_SPM);

  if (data && data.feature && data.feature.length > 0 && showSearchFuture) {
    return (
      <Wrapper>
        <Title inDrawer={inDrawer}>
          <span>{t('5UnWKFvimpbzaE1UkugYLU')}</span>
        </Title>
        {inDrawer ? (
          <H5Content>
            {map(data.feature, (item, index) => {
              if (index < 3) {
                const url = addLangToPath(`${KUMEX_TRADE}/${item.symbol}`, lang);
                const { baseCurrency, type, settleDate, quoteCurrency } =
                  futuresSymbols.find((i) => i.symbol === item.symbol) || {};
                return (
                  <H5SymbolItem key={item.symbol} href={url} onClick={() => markHistory(index)}>
                    <CodeName>
                      <FutureSymbolText
                        isTag
                        symbol={item.symbol}
                        contract={{
                          baseCurrency,
                          type,
                          settleDate,
                          quoteCurrency,
                        }}
                      />
                    </CodeName>
                    <PriceRate rate={item.changeRate} price={item.price} lang={lang} inDrawer />
                  </H5SymbolItem>
                );
              }
              return null;
            })}
          </H5Content>
        ) : (
          <Content>
            {map(data.feature, (item, index) => {
              if (index < 3) {
                const url = addLangToPath(`${KUMEX_TRADE}/${item.symbol}`, lang);
                const { baseCurrency, type, settleDate, quoteCurrency } =
                  futuresSymbols.find((i) => i.symbol === item.symbol) || {};
                return (
                  <SymbolItem key={item.symbol} href={url} onClick={() => markHistory(index)}>
                    <CodeName>
                      <FutureSymbolText
                        isTag
                        symbol={item.symbol}
                        contract={{
                          baseCurrency,
                          type,
                          settleDate,
                          quoteCurrency,
                        }}
                      />
                    </CodeName>
                    <PriceRate rate={item.changeRate} price={item.price} lang={lang} />
                  </SymbolItem>
                );
              }
              return null;
            })}
          </Content>
        )}
      </Wrapper>
    );
  }
  return null;
};
