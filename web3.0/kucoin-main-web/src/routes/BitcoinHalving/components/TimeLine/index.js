/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { useResponsive } from '@kux/mui';
import go from 'static/bitcoin-halving/go.svg';
import { _t, addLangToPath } from 'src/tools/i18n';
import siteConfig from 'utils/siteConfig';
import TimeLineLg from './components/TimeLineLg';
import TimeLineMd from './components/TimeLineMd';
import TimeLineH5 from './components/TimeLineH5';
import { Wrapper, Button } from './index.style';

const { KUCOIN_HOST } = siteConfig;

export default () => {
  const responsive = useResponsive();

  return (
    <Wrapper>
      {responsive.lg && <TimeLineLg />}
      {!responsive.lg && responsive.sm && <TimeLineMd />}
      {!responsive.sm && <TimeLineH5 />}
      <Button href={addLangToPath(`${KUCOIN_HOST}/learn/crypto/bitcoin-halving-countdown`)}>
        {_t('ciAQnSHtMzARpF993wUjiG')}
        <img src={go} alt="go" />
      </Button>
    </Wrapper>
  );
};
