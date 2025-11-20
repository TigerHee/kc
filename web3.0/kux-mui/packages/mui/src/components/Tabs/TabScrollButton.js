/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import useTheme from 'hooks/useTheme';
import { LeftOutlined, RightOutlined } from '@kux/icons';
import { TabScrollButtonRoot, TabScrollButtonOverlay } from './kux';
import { useScrollButtonClassNames } from './useClassNames';

const sizeMap = {
  xsmall: 16,
  small: 16,
  medium: 16,
  large: 20,
  xlarge: 24,
};

const TabScrollButton = React.forwardRef((props, ref) => {
  const { direction, disabled, onClick, className, size, variant, type } = props;
  const theme = useTheme();
  const buttonSize =
    type === 'text' || type === 'normal' ? 16 : variant === 'bordered' ? 'large' : size;

  const _classNames = useScrollButtonClassNames({ direction });

  return (
    <TabScrollButtonRoot
      className={className}
      theme={theme}
      direction={direction}
      ref={ref}
      size={buttonSize}
      variant={variant}
      type={type}
    >
      <TabScrollButtonOverlay
        size={size}
        theme={theme}
        direction={direction}
        className={_classNames.scrollButtonBg}
      />
      {!disabled &&
        (direction === 'left' ? (
          <LeftOutlined size={sizeMap[buttonSize]} onClick={onClick} color={theme.colors.icon60} />
        ) : (
          <RightOutlined size={sizeMap[buttonSize]} onClick={onClick} color={theme.colors.icon60} />
        ))}
    </TabScrollButtonRoot>
  );
});

export default TabScrollButton;
