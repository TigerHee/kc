import React from 'react';
import { Alert, styled } from '@kux/mui';

const TipContainer = styled.section`
  margin-bottom: 24px;
`;

const AlertWrapper = styled(Alert)`
  .KuxAlert-icon {
    margin-top: 0;
    padding-top: 0;
    height: 18px;
  }
`;

const ErrorAlert = ({ msg }) => {
  if (!msg) return null;
  return (
    <TipContainer data-inspector="error-alert">
      <AlertWrapper title={msg} closable={false} type="error" showIcon />
    </TipContainer>
  );
};

export default ErrorAlert;
