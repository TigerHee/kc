/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import clsx from 'clsx';
import useClassNames from './useClassNames';
import { DividerRoot, DividerRootWithChildren, ChildrenWrapper } from './kux';

const Divider = React.forwardRef(({ orientation, children, type, className, ...others }, ref) => {
  const theme = useTheme();
  const shouldShowChildren = type === 'horizontal' && !!children;
  const _classNames = useClassNames({ orientation, type, ...others });
  if (shouldShowChildren) {
    return (
      <DividerRootWithChildren
        {...others}
        orientation={orientation}
        theme={theme}
        type={type}
        ref={ref}
        className={clsx(_classNames.root, className)}
      >
        {children ? (
          <ChildrenWrapper className={_classNames.text} theme={theme}>
            {children}
          </ChildrenWrapper>
        ) : null}
      </DividerRootWithChildren>
    );
  }
  return (
    <DividerRoot
      {...others}
      theme={theme}
      type={type}
      ref={ref}
      className={clsx(_classNames.root, className)}
    />
  );
});

Divider.displayName = 'Divider';

Divider.propTypes = {
  type: PropTypes.oneOf(['horizontal', 'vertical']), // 横向或竖向
  orientation: PropTypes.oneOf(['left', 'center', 'right']),
  children: PropTypes.node,
};

Divider.defaultProps = {
  type: 'horizontal',
  orientation: 'center',
};

export default Divider;
