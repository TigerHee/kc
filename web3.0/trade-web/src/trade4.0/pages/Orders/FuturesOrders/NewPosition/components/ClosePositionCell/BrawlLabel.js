/**
 * Owner: clyne@kupotech.com
 */

import React from 'react';
import { ICArrowRightOutlined } from '@kux/icons';
import { useI18n, styled } from '@/pages/Futures/import';
import { Link } from 'components/Router';

const LinkBrawl = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const BrawlLabel = () => {
  const { _t } = useI18n();
  return (
    <LinkBrawl className="brawlbox" href="/futures/lite/brawl/XBTUSDTM" target="_blank">
      {_t('brawl.pending')}
      <ICArrowRightOutlined />
    </LinkBrawl>
  );
};

export default BrawlLabel;
