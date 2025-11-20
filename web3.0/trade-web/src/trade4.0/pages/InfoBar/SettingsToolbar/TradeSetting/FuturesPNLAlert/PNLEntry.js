/**
 * Owner: clyne@kupotech.com
 */
import React, { useEffect } from 'react';

import { styled } from '@kux/mui/emotion';
import { RightOutlined } from '@kufox/icons';
import useI18n from '@/hooks/futures/useI18n';
import { useIsRTL } from '@/hooks/common/useLang';

import { usePnlAlertFunc, usePnlAlert } from './hooks/usePnlAlert';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text60};
`;

const PNLEntry = ({ onClick }) => {
  const { _t } = useI18n();
  const closeText = _t('setting.pnl.state.close');
  const openText = _t('prompt.open');

  const { getPnlAlertConfig } = usePnlAlertFunc();
  const { checked } = usePnlAlert();
  const isRtl = useIsRTL();

  // 入口处，请求一次
  useEffect(() => {
    getPnlAlertConfig();
    futuresSensors.pnlAlert.preferenceClick();
  }, [getPnlAlertConfig]);

  const stateText = checked ? openText : closeText;
  return (
    <Wrapper onClick={onClick} isRtl={isRtl}>
      {stateText}
    </Wrapper>
  );
};

export default PNLEntry;
