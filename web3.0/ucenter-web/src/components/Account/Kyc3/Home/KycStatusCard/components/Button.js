/**
 * Owner: willen@kupotech.com
 */

import { ICArrowRight2Outlined } from '@kux/icons';
import { Button, styled, useResponsive, useTheme } from '@kux/mui';

const ButtonWrapper = styled(Button)``;

const ExtendIcon = styled(ICArrowRight2Outlined)`
  font-size: ${({ xsize }) => (xsize === 'large' ? '20px' : '16px')};
  margin-left: 8px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const BaseButton = ({
  children,
  className,
  size = 'large',
  showIcon = true,
  onClick,
  loading,
  disabled,
  ...otherProps
}) => {
  const theme = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  size = size ? size : isH5 ? 'basic' : 'large';

  return (
    <ButtonWrapper
      {...otherProps}
      className={className}
      size={size}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      <span>{children}</span>
      {showIcon ? <ExtendIcon xsize={size} /> : null}
    </ButtonWrapper>
  );
};

export default BaseButton;
