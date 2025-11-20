/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import clsx from 'clsx';
import CircleLight from '@kux/icons/static/circle_light.svg';
import CircleDark from '@kux/icons/static/circle_dark.svg';
import ShapeLogo from '@kux/icons/static/circle_logo.svg';
import NormalLoadingLogo from '@kux/icons/static/loading.svg';
import useClassNames from './useClassNames';
import { SpinRoot, SpinBox, StyledContainer, CircleLogo, CircleCircle, NormalLoading } from './kux';

const Spin = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const { currentTheme } = theme;
  const isNestedPattern = !!(props && props.children);
  const { size, spinning: spinningProp, className, ...restProps } = props;
  const [spinning, updateSpinning] = useState(spinningProp);

  useEffect(() => {
    updateSpinning(spinningProp);
  }, [spinningProp]);

  const _classNames = useClassNames({ size, theme: currentTheme });

  return (
    <SpinRoot
      isNestedPattern={isNestedPattern}
      className={clsx(_classNames.root, className)}
      ref={ref}
      type={props.type}
      size={size}
      {...restProps}
    >
      {spinning && (
        <SpinBox
          size={size}
          className={_classNames.wrapper}
          isNestedPattern={isNestedPattern}
          type={props.type}
        >
          {props.type === 'brand' ? (
            <React.Fragment>
              <CircleCircle
                src={currentTheme === 'dark' ? CircleDark : CircleLight}
                size={size}
                className={_classNames.circle}
              />
              <CircleLogo src={ShapeLogo} size={size} className={_classNames.logo} />
            </React.Fragment>
          ) : (
            <NormalLoading src={NormalLoadingLogo} className={_classNames.normalLoading} />
          )}
        </SpinBox>
      )}
      <StyledContainer className={_classNames.container} spinning={spinning} theme={theme}>
        {props.children}
      </StyledContainer>
    </SpinRoot>
  );
});

Spin.displayName = 'Spin';

Spin.propTypes = {
  spinning: PropTypes.bool,
  size: PropTypes.oneOf(['basic', 'small', 'xsmall']),
  type: PropTypes.oneOf(['normal', 'brand']),
};

Spin.defaultProps = {
  spinning: true,
  size: 'basic',
  type: 'brand',
};

export default Spin;
