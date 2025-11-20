/*
 * owner: Borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Button, styled, useResponsive } from '@kux/mui';
import { forwardRef } from 'react';

const StyledButton = styled(Button)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    &.KuxButton-loading {
      & > svg {
        margin-right: 0;
      }
    }
  }
`;

const MuiButton = forwardRef(({ loading, children, ...otherProps }, ref) => {
  const { sm } = useResponsive();
  const isInApp = JsBridge.isApp();
  return (
    <StyledButton ref={ref} loading={loading} {...otherProps}>
      {(!sm || isInApp) && loading ? null : children}
    </StyledButton>
  );
});

export default MuiButton;
