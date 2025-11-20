/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';
import { isEmpty } from 'lodash';
import React, { useState, useMemo } from 'react';
import { _t } from 'src/utils/lang';
import CurrencyItem from './CurrencyItem';
import {
  List,
  SectionHeader,
  Index,
  ItemWrapper,
  ItemSubject,
  ItemDesc,
  FooterWrapper,
  StyledArrowDown,
} from './StyledComps';
import useSymbolData from './useSymbolData';

const SubjectItem = ({ item }) => {
  const { subject, subjectLanguageId = '', subjectDesLanguageId = '', currencyConfigs = [] } =
    item || {};
  const symbolMap = useSelector(state => state.ethMerge.symbolMap || {});
  const sortedList = useMemo(
    () => {
      if (isEmpty(symbolMap)) return currencyConfigs;
      return currencyConfigs.sort(
        (a, b) =>
          (symbolMap[(b?.symbol)]?.priceChangeRate24h || 0) -
          (symbolMap[(a?.symbol)]?.priceChangeRate24h || 0),
      );
    },
    [symbolMap],
  );
  return (
    <ItemWrapper key={subject}>
      <ItemSubject>
        <span>{_t(subjectLanguageId) || subject}</span>
      </ItemSubject>
      <ItemDesc>{_t(subjectDesLanguageId)}</ItemDesc>
      <>
        {sortedList.map(item => (
          <CurrencyItem item={item} key={`${subject}-${item.symbol}`} />
        ))}
      </>
    </ItemWrapper>
  );
};

const ListFooter = ({ expand, onClick }) => {
  return (
    <FooterWrapper onClick={onClick} expand={expand}>
      <>{expand ? _t('taskCenter.showLess') : _t('taskCenter.showMore')}</>
      <StyledArrowDown fill="currentColor" expand={expand} />
    </FooterWrapper>
  );
};

const CoinList = () => {
  const { marketConfig = [] } = useSelector(state => state.ethMerge.activityConfig || {});
  const [expand, setExpand] = useState(false);
  useSymbolData();

  return (
    !!marketConfig.length && (
      <Index>
        <SectionHeader>{_t('avN5Z439UwpHYtVb98Pan6')}</SectionHeader>
        <List style={{ height: expand ? '100%' : 835 }}>
          <>
            {marketConfig.map(item => (
              <SubjectItem item={item} key={item.subject} />
            ))}
          </>
          <ListFooter onClick={() => setExpand(!expand)} expand={expand} />
        </List>
      </Index>
    )
  );
};

export default CoinList;
