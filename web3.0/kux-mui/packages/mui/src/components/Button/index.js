/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'hooks/index';
import clsx from 'clsx';
import useClassNames from './useClassNames';
import { ButtonRoot, LoadingIcon, ButtonStartIcon, ButtonEndIcon } from './kux';

const Button = React.forwardRef(
  (
    { children, loading, disabled, startIcon, endIcon, htmlType, className, type, ...props },
    ref,
  ) => {
    const theme = useTheme();
    const commonState = {
      ...props,
      disabled,
      type,
      loading,
    };

    const _classNames = useClassNames(commonState);

    return (
      <ButtonRoot
        {...props}
        className={clsx(_classNames.root, className)}
        btnType={type}
        type={htmlType}
        theme={theme}
        inLoading={loading}
        disabled={disabled}
        ref={ref}
        startIcon={startIcon}
        endIcon={endIcon}
      >
        {loading ? <LoadingIcon /> : null}
        {startIcon ? (
          <ButtonStartIcon className={_classNames.startIcon}>{startIcon}</ButtonStartIcon>
        ) : null}
        {children}
        {endIcon ? <ButtonEndIcon className={_classNames.endIcon}>{endIcon}</ButtonEndIcon> : null}
      </ButtonRoot>
    );
  },
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['basic', 'large', 'small', 'mini']),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained', 'icon']),
  type: PropTypes.oneOf(['primary', 'default', 'secondary', 'brandGreen']),
  htmlType: PropTypes.string,
};

Button.defaultProps = {
  variant: 'contained',
  size: 'basic',
  loading: false,
  disabled: false,
  type: 'primary',
  htmlType: 'button',
};

Button.displayName = 'Button';

export default Button;
