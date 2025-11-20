/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'hooks/index';
import clsx from 'clsx';
import useClassNames from './useClassNames';
import { TypographyRoot } from './kux';

const fontsMap = {
  h1: 'x8l',
  h2: 'x7l',
  h3: 'x6l',
  h4: 'x5l',
  h5: 'x4l',
  h6: 'x3l',
};

const Typography = React.forwardRef(({ variant, className, children, ...props }, ref) => {
  const theme = useTheme();

  const _classNames = useClassNames({ ...props, variant });
  const fonts = theme.fonts.size[fontsMap[variant] || fontsMap.h1];

  return (
    <TypographyRoot
      {...props}
      className={clsx(_classNames.root, className)}
      theme={theme}
      ref={ref}
      as={variant}
      fonts={fonts}
    >
      {children}
    </TypographyRoot>
  );
});

Typography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  size: PropTypes.string,
};

Typography.defaultProps = {
  variant: 'h1',
  size: '',
};

Typography.displayName = 'Typography';

export default Typography;
