/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t } from 'src/utils/lang';
import CurrencyItem from './CurrencyItem';
import { List, SectionHeader, Index, ItemWrapper, ItemSubject } from './StyledComps';
import useSymbolData from './useSymbolData';
import { SYMBOLS_CONFIG } from './config';


const CoinList = () => {
  useSymbolData();

  return (
    <Index>
      <SectionHeader>{_t('wWTamoKFqyYhh5DNbQiFMn')}</SectionHeader>
      <List style={{ height: '100%' }}>
        <ItemWrapper>
          <ItemSubject>
            <span>Terra</span>
          </ItemSubject>
          <>
            {SYMBOLS_CONFIG.map(item => (
              <CurrencyItem item={item} key={item.currency} />
            ))}
          </>
        </ItemWrapper>
      </List>
    </Index>
  );
};

export default CoinList;
