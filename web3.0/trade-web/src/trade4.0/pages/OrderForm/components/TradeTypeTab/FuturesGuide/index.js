/**
 * Owner: garuda@kupotech.com
 * Desc: 合约引导
 */
import React, { memo } from 'react';
import styled from '@emotion/styled';
import { _t } from 'src/utils/lang';
import GuideTooltip from '@/components/GuideTooltip';

const StyledGuideTooltip = styled(GuideTooltip)`
  position: relative;
  top: -20px;
  z-index: -1;
`;

const FuturesGuide = () => {
  return (
    <StyledGuideTooltip
      placement="left"
      code="futuresTraing"
      title={_t('futures.guide.ot')}
      describe={_t('futures.guide.od')}
      iconProps={{ type: 'guide-icon', fileName: 'futures' }}
    />
  );
};

export default memo(FuturesGuide);
