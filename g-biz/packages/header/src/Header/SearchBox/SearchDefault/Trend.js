/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { map } from 'lodash';
import { styled } from '@kux/mui';
import { useLang } from '../../../hookTool';
import PriceRate from './PriceRate';
import SymbolCodeToName from '../../../components/SymbolCodeToName';
import { Wrapper, Title, Content, SymbolItem, H5Content, H5SymbolItem } from './styled';
import { kcsensorsManualTrack, kcsensorsClick, addLangToPath } from '../../../common/tools';

const CodeName = styled.div`
  display: flex;
  align-items: center;
  height: 18px;
  margin-bottom: 4px;
`;

const TRADE_PATH = '/trade';

export default (props) => {
  const { data, inDrawer, lang } = props;
  const { t } = useLang();

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearchTopSearch', '1'], {
      pagecate: 'NavigationSearchTopSearch',
    });
  }, []);

  const markHistory = useCallback((index) => {
    kcsensorsClick(['NavigationSearchTopSearch', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchTopSearch',
    });
  }, []);
  if (data && data.spot && data.spot.length > 0) {
    return (
      <Wrapper>
        <Title inDrawer={inDrawer}>
          <span>{t('wkrjMts2VZUjxjFKvh6BXJ')}</span>
        </Title>
        {inDrawer ? (
          <H5Content>
            {map(data.spot, (item, index) => {
              const url = addLangToPath(`${TRADE_PATH}/${item.symbol}`, lang);
              if (index < 3) {
                return (
                  <H5SymbolItem key={item.symbol} href={url} onClick={() => markHistory(index)}>
                    <CodeName>
                      <SymbolCodeToName code={item.symbol} noIcon />
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
            {map(data.spot, (item, index) => {
              const url = addLangToPath(`${TRADE_PATH}/${item.symbol}`, lang);
              if (index < 3) {
                return (
                  <SymbolItem key={item.symbol} href={url} onClick={() => markHistory(index)}>
                    <CodeName>
                      <SymbolCodeToName code={item.symbol} noIcon />
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
