import React from 'react';
import {getBaseCurrency} from 'site/tenant';
import styled, {css} from '@emotion/native';

import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {convertPxToReal} from 'utils/computedPx';
import {formatNumberShow} from 'utils/helper';
import {
  DescText,
  FollowerAndProfitNumberFormat,
  FollowerProfitAndAssetSizeWrapper,
} from '../styles';

const FootDescText = styled(DescText)`
  max-width: ${convertPxToReal(110)};
  margin-right: 4px;
`;

export const FooterProfitAsset = ({
  showLeadAmount,
  followerPnl,
  leadAmount,
  followerAum,
  homeNewUI,
}) => {
  const {_t} = useLang();

  return (
    <FollowerProfitAndAssetSizeWrapper homeNewUI={homeNewUI}>
      <RowWrap
        style={css`
          flex: 1;
        `}>
        <FootDescText>
          {_t('6171e28582e84000a21a', {symbol: getBaseCurrency()})}
        </FootDescText>
        <RowWrap
          style={css`
            flex: 1;
            margin-left: auto;
          `}>
          <FollowerAndProfitNumberFormat homeNewUI={homeNewUI}>
            {formatNumberShow(followerPnl, 1)}
          </FollowerAndProfitNumberFormat>
        </RowWrap>
      </RowWrap>
      <RowWrap
        style={css`
          flex: 1;
          justify-content: flex-end;
        `}>
        <FootDescText>
          {_t('8d73446ded454000ae7b', {symbol: getBaseCurrency()})}
        </FootDescText>

        <RowWrap>
          <FollowerAndProfitNumberFormat
            homeNewUI={homeNewUI}
            style={css`
              text-align: right;
              max-width: ${convertPxToReal(80)};
            `}>
            {formatNumberShow(showLeadAmount ? leadAmount : followerAum, 1)}
          </FollowerAndProfitNumberFormat>
        </RowWrap>
      </RowWrap>
    </FollowerProfitAndAssetSizeWrapper>
  );
};
