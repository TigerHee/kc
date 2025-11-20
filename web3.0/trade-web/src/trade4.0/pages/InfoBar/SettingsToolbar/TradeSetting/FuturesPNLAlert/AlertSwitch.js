/**
 * Owner: clyne@kupotech.com
 */

import { styled } from '@/style/emotion';
import React from 'react';
import useI18n from '@/hooks/futures/useI18n';
import KuxSwitch from '@mui/Switch';
import { usePnlAlert } from './hooks/usePnlAlert';

const AlertWrapper = styled.div`
  .alert-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    color: ${(props) => props.theme.colors.text};
  }
  .desc {
    color: ${(props) => props.theme.colors.text40};
    font-size: 14px;
    font-style: normal;
    padding-bottom: 29px;
    border-bottom: 1px solid
      ${(props) => {
        return props.theme.colors.divider4;
      }};
  }
`;

const AlertSwitch = () => {
  const { _t } = useI18n();
  const { checked, onChange } = usePnlAlert();
  return (
    <AlertWrapper>
      <div className="alert-switch">
        <div className="title">{_t('setting.pnl.alert')}</div>
        <KuxSwitch checked={checked} onChange={onChange} />
      </div>
      <div className="desc">{_t('setting.pnl.detail')}</div>
    </AlertWrapper>
  );
};

export default AlertSwitch;
