/**
 * Owner: judith.zhu@kupotech.com
 */
import React from 'react';
import { Switch } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
import { useTranslation } from '@tools/i18n';

const MultiBox = styled.div`
  display: flex;
  align-items: center;
  .label {
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.text40};
    font-size: 14px;
    line-height: 16px;
  }
  input[type='checkbox'] {
    width: 28px;
    height: 16px;
  }
`;

export default ({ onSwitchChange, style, checked, defaultChecked = false }) => {
  const { t: _t } = useTranslation('transfer');
  return (
    <MultiBox style={style}>
      <span className="label">{_t('transfer.batch.switch')}</span>
      <Switch
        defaultChecked={defaultChecked}
        checked={checked}
        size="small"
        onChange={onSwitchChange}
      />
    </MultiBox>
  );
};
