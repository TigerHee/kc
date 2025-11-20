/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';
import React, { useCallback } from 'react';
import { openPage } from 'src/helper';
import { addLangToPath, _t } from 'src/utils/lang';
import { sensors } from 'src/utils/sensors';
import { KUCOIN_HOST } from 'utils/siteConfig';
import {
  ChangeRate,
  Duration,
  Info,
  ItemBody,
  ItemDesc,
  ItemHeader,
  ListItem,
  StyledArrowRight,
} from './StyledComps';

const getDurationStr = duration => {
  switch (duration) {
    case '0':
      return 'Flexible'; // 活期
    case '-1':
      return 'Fixed'; // 定期
    default:
      return `${duration}${_t('pTkcrA85gNKFEyHD1Fdfpg')}`; // 活期
  }
};

const ProductCard = ({ product }) => {
  const { currency, category, productLanguageId, name, duration, totalApr } = product;
  const { isInApp } = useSelector(state => state.app);
  const handleClick = useCallback(
    () => {
      sensors.trackClick(['Earn', '1']);
      const lowerCaseName = name?.toLowerCase() || '';
      const backUrl = encodeURIComponent(window.location.href);
      let url = '';
      if (lowerCaseName.includes('eth2')) {
        url = `${KUCOIN_HOST}/earn/eth2?backUrl=${backUrl}`;
      } else {
        url = `${KUCOIN_HOST}/earn?currency=${currency}&backUrl=${backUrl}`;
      }
      openPage(isInApp, addLangToPath(url));
    },
    [currency, isInApp, name],
  );
  return (
    <ListItem onClick={handleClick}>
      <ItemHeader>
        <span>{currency}</span>
        <StyledArrowRight />
      </ItemHeader>
      <ItemDesc>{_t(productLanguageId)}</ItemDesc>
      <ItemBody>
        <Duration>{getDurationStr(duration)}</Duration>
        <Info>
          <span>APY</span>
          <ChangeRate>
            <>{totalApr}</>%
          </ChangeRate>
        </Info>
      </ItemBody>
    </ListItem>
  );
};

export default ProductCard;
