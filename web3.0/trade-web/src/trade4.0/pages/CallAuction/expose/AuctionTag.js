/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import Tooltip from '@mui/Tooltip';
import { eTheme } from '@/utils/theme';

const AuctionTagSpan = styled.div`
  width: auto;
  padding: 0 2px;
  height: 16px;
  background-image: linear-gradient(231deg, #1fbe96 0%, #2ed88e 100%);
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  margin-left: 6px;
  word-break: keep-all;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
  height: 18px;
  ${(props) => fx.color(props, 'textEmphasis')};
`;

const AuctionTag = memo(() => {
  const auctionName = String(_t('trd.ca.title', { symbol: '' })).trim();
  return (
    <Tooltip
      title={auctionName}
      placement="bottom-start"
      trigger="hover"
    >
      <AuctionTagSpan>
        <span>{auctionName}</span>
      </AuctionTagSpan>
    </Tooltip>
  );
});

const AuctionDiv = styled.div`
  color:${eTheme('complementary')};
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  max-width: 80px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: -3px;
`;

export const AuctionTabTag = memo(() => {
  const auctionName = String(_t('trd.ca.title', { symbol: '' })).trim();
  return (
    <Tooltip
      title={auctionName}
      placement="bottom-start"
      trigger="hover"
    >
      <AuctionDiv>
        {auctionName}
      </AuctionDiv>
    </Tooltip>
  );
});

export default AuctionTag;
