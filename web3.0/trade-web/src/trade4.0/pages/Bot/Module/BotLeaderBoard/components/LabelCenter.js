/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { _t } from 'Bot/utils/lang';

const LabelCenter = styled.p`
  display: flex;
  align-items: center;
  padding: 10px 0;

  div {
    color: ${({ theme }) => theme.colors.text40};
    font-size: 12px;
    padding: 0 16px;
  }

  span {
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider4};
  }
`;
export default ({ label = _t('machinedetail15'), className }) => {
  return (
    <LabelCenter className={className}>
      <span />
      <div>{label}</div>
      <span />
    </LabelCenter>
  );
};
