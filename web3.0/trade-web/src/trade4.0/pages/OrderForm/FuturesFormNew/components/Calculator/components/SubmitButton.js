/**
 * Owner: garuda@kupotech.com
 */

import React, { useMemo } from 'react';

import { useResponsive } from '@kux/mui';

import Button from '@mui/Button';

import { _t, styled } from '../../../builtinCommon';

const ButtonWrapper = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 24px 16px;
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  background: ${(props) => props.theme.colors.layer};
`;

const ButtonCls = styled(Button)`
  position: absolute;
  bottom: 0;
`;

const SubmitButton = ({ onSubmit }) => {
  const { xs, sm } = useResponsive();
  const isMobile = useMemo(() => xs && !sm, [sm, xs]);

  return isMobile ? (
    <ButtonWrapper>
      <Button type="primary" variant="contained" fullWidth onClick={onSubmit}>
        {_t('calc.title')}
      </Button>
    </ButtonWrapper>
  ) : (
    <ButtonCls type="primary" variant="contained" fullWidth onClick={onSubmit}>
      {_t('calc.title')}
    </ButtonCls>
  );
};

export default React.memo(SubmitButton);
