/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useMemo, useRef } from 'react';
import Tooltip from '@mui/Tooltip';
import { styled } from '@/style/emotion';
import { eTheme, eConditionStyle, eScreenStyle } from '@/utils/theme';
import { separateNumber } from 'helper';
import { dropZeroSafe } from '@/utils/digit';
import useDomBox from '@/hooks/useDomBox';
import { valIsEmpty } from 'src/utils/base';
import { _t } from 'utils/lang';

const InfoWrap = styled.div`
  border-radius: 12px;
  margin: 16px 0;
  padding: 16px 8px 4px 0;
  background: ${eTheme('cover2')};
  display: flex;
  flex-wrap: wrap;
`;

const InfoTitleDiv = styled.div`
  font-weight: 400;
  font-size: 12px;
  margin-bottom: 8px;
  color:${eTheme('text60')};
  text-decoration: underline ${eTheme('text40')} dashed;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
  vertical-align: text-top;
  display: inline-block;
`;

const InfoDataDiv = styled.div`
display: flex;
`;

const InfoDataSpan = styled.span`
  font-weight: 700;
  font-size: 16px;
  ${eConditionStyle(true, 'changed')`
    color: ${eTheme('primary')};
  `}
`;

const InfoUnitSpan = styled.span`
  font-weight: 600;
  font-size: 16px;
  padding-left: 6px;
  color: ${eTheme('text40')};
`;

const setFlexBasis = (count) => {
  return `flex-basis: ${ 100 / count}%;`;
};

const InfoContentDiv = styled.div`
  padding: 0 4px 12px 12px;
  flex: none;
  overflow: hidden;
  ${setFlexBasis(5)}
  ${eScreenStyle('lg1')`
    ${setFlexBasis(3)}
  `}
  ${eScreenStyle('lg')`
    ${setFlexBasis(2)}
  `}
  ${eScreenStyle(['sm', 'md'])`
    ${setFlexBasis(1)}
    &:not(:last-of-type) {
      padding-bottom: 24px;
    }
  `}
`;

const EmptyText = styled.span`
  color: ${eTheme('text40')};
`;

const TipDiv = styled.div`
  max-width: 320px;
`;

const InfoContent = (props) => {
  const { title, data, unit, tip, changed, limitWidth = false, screen } = props;
  const titleRef = useRef();
  const { width } = useDomBox(titleRef);
  const divInfoStyle = limitWidth ? { width } : undefined;
  const textContent = data === '--' ? <EmptyText>--</EmptyText> : data;
  return (<InfoContentDiv screen={screen}>
    <Tooltip title={<TipDiv>{tip}</TipDiv>} trigger="hover" placement="top">
      <InfoTitleDiv ref={titleRef}>{title}</InfoTitleDiv>
    </Tooltip>
    { (!limitWidth || !!width) && <InfoDataDiv style={divInfoStyle}>
      <InfoDataSpan changed={changed}>{textContent}</InfoDataSpan>
      <InfoUnitSpan >{unit}</InfoUnitSpan>
    </InfoDataDiv> }
  </InfoContentDiv>);
};

/**
 * 集合竞价介绍
 * @param {{
 *  auctionData: Record<string, any>,
 *  currentSymbol: string,
 *  auctionConf: Record<string, any>,
 *  screen: string
 * }} props
 */
const Info = (props) => {
  const { auctionData, currentSymbol, auctionConf, screen } = props;
  const costPrice = auctionConf?.costPrice;

  const data = useMemo(() => {
    const [base, quote] = String(currentSymbol).split('-');
    const {
      estimatedDealPrice,
      estimatedDealSize,
      highestBuyDeclaredPrice,
      lowestBuyDeclaredPrice,
      highestSellDeclaredPrice,
      lowestSellDeclaredPrice,
    } = auctionData || {};
    return [
      {
        title: _t('cSvg2HrXvV8Hipro6HgGNT'),
        unit: quote,
        data: costPrice,
        tip: _t('trd.ca.issuePrice.tip'),
      }, {
        title: _t('trd.ca.estimate.price'),
        unit: quote,
        data: estimatedDealPrice,
        changed: true,
        tip: _t('trd.ca.estimate.price.tip'),
      }, {
        title: _t('trd.ca.estimate.vol'),
        unit: base,
        data: estimatedDealSize,
        changed: true,
        tip: _t('trd.ca.estimate.vol.tip'),
      }, {
        title: _t('trd.ca.buy.price.range'),
        unit: quote,
        data: [lowestBuyDeclaredPrice, highestBuyDeclaredPrice],
        tip: _t('trd.ca.buy.price.range.tip'),
      }, {
        title: _t('trd.ca.sell.price.range'),
        unit: quote,
        data: [lowestSellDeclaredPrice, highestSellDeclaredPrice],
        tip: _t('trd.ca.sell.price.range.tip'),
      },
    ];
  }, [currentSymbol, auctionData, costPrice]);
  const list = useMemo(() => {
    return data.map((item) => {
      let { data: values } = item;
      const isArr = Array.isArray(values);
      if (valIsEmpty(values)) {
        values = '--';
      } else if (isArr) {
        // 数据全部为空
        const isEmpty = values.filter(value => !valIsEmpty(value)).length === 0;
        if (isEmpty) {
          values = ['--'];
        } else {
          values = values.map(value => (valIsEmpty(value) ? '--' : value));
        }
      }
      return {
        ...item,
        limitWidth: isArr,
        data: isArr ?
        values.map(val => separateNumber(dropZeroSafe(val))).join(' ~ ') : separateNumber(dropZeroSafe(values)),
      };
    });
  }, [data]);
  return (
    <InfoWrap>
      {list.map((item, index) => (
        <InfoContent {...item} key={String(index)} screen={screen} />
      ))}
    </InfoWrap>
  );
};

export default memo(Info);
