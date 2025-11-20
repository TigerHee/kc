/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { Link } from 'src/components/Router';
import { ICArrowRightOutlined } from '@kux/icons';
import { _t } from 'utils/lang';
import { styled } from 'src/trade4.0/style/emotion';

const LinkBrawl = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Maintenance = () => {
  return (
    <LinkBrawl className="brawlbox" to="/futures/lite/brawl/XBTUSDTM" target="_blank">
      {_t('brawl.pending')}
      <ICArrowRightOutlined />
    </LinkBrawl>
  );
};

export default Maintenance;
