/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import { styled } from '@kux/mui/emotion';

import { siteCfg } from 'config';

import { trackClick } from 'src/utils/ga';
import { _t, addLangToPath } from 'utils/lang';

import Button from '@mui/Button';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { RISK_LIMIT } from '@/meta/futuresSensors/trade';

import { FuturesButtonWrapper } from '../../style';

const ContentBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.text40};
`;

const CrossView = (props) => {
  const symbol = useGetCurrentSymbol();

  const handleGo = useCallback(() => {
    // 埋点
    trackClick([RISK_LIMIT, '5']);
  }, []);

  return (
    <>
      <ContentBox>{_t('futures.cross.intro')}</ContentBox>
      <a
        href={addLangToPath(`${siteCfg.MAINSITE_HOST}/futures/contract/risk-limit/${symbol}`)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleGo}
      >
       {_t('global.more')}
      </a>
      <FuturesButtonWrapper>
        <Button variant="contained" onClick={props?.onOk}>
          {_t('security.form.btn')}
        </Button>
      </FuturesButtonWrapper>
    </>
  );
};

export default React.memo(CrossView);
