import React, {memo} from 'react';
import {getBaseCurrency} from 'site/tenant';

import useLang from 'hooks/useLang';
import {
  CopyProfitHeaderWrapper,
  CurrentCopyAmountLabel,
  CurrentCopyAmountWrap,
  DescText,
  FirstProfitDescWrap,
  LargeProfit,
  ShareProfitItem,
  SharingProfitAmount,
  SharingProfitRatio,
} from './styles';

const CopyProfitContent = ({
  cumulativeProfitSharing,
  unrealizedProfitSharing,
  profitSharingRatio,
}) => {
  const {_t} = useLang();
  return (
    <CopyProfitHeaderWrapper>
      <FirstProfitDescWrap>
        <DescText>
          {_t('572ef8ed680e4000ac6f', {symbol: getBaseCurrency()})}
        </DescText>
        <LargeProfit isProfitNumber isPositive>
          {cumulativeProfitSharing}
        </LargeProfit>
      </FirstProfitDescWrap>
      <CurrentCopyAmountWrap>
        <ShareProfitItem>
          <CurrentCopyAmountLabel>
            {_t('2e34a1c888504000aad3', {symbol: getBaseCurrency()})}
          </CurrentCopyAmountLabel>
          <SharingProfitAmount isProfitNumber>
            {unrealizedProfitSharing}
          </SharingProfitAmount>
        </ShareProfitItem>

        <ShareProfitItem>
          <CurrentCopyAmountLabel>
            {_t('c9e75b81a8324000a85f')}
          </CurrentCopyAmountLabel>
          <SharingProfitRatio>{profitSharingRatio}</SharingProfitRatio>
        </ShareProfitItem>
      </CurrentCopyAmountWrap>
    </CopyProfitHeaderWrapper>
  );
};

export default memo(CopyProfitContent);
