/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import { variant } from 'styled-system';
import useTheme from 'hooks/useTheme';
import isNumber from 'lodash/isNumber';
import { composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';
import getAvatarClassName from './classNames';

const useClassNames = (state) => {
  const { classNames: classNamesFromState, variant, size } = state;
  const slots = {
    root: ['root', variant, typeof size !== 'number' && `${variant}${capitalize(size)}`],
    img: ['img'],
  };
  return composeClassNames(slots, getAvatarClassName, classNamesFromState);
};

function useLoaded({ src }) {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!src) {
      return undefined;
    }

    setLoaded(false);

    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) {
        return;
      }
      setLoaded('loaded');
    };
    image.onerror = () => {
      if (!active) {
        return;
      }
      setLoaded('error');
    };
    image.src = src;

    return () => {
      active = false;
    };
  }, [src]);
  return loaded;
}

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  text-align: center;
  object-fit: cover;
  color: transparent;
  text-indent: 10000px;
`;

const AvatarRoot = styled.div`
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  user-select: none;
  font-family: ${(props) => props.theme.fonts.family};
  border: 1px solid ${(props) => props.theme.colors.text};
  color: ${(props) => props.theme.colors.text};
  width: ${({ size }) => {
    if (isNumber(size)) {
      return `${size}px`;
    }
    return undefined;
  }};
  height: ${({ size }) => {
    if (isNumber(size)) {
      return `${size}px`;
    }
    return undefined;
  }};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        width: '24px',
        height: '24px',
        fontSize: '12px',
      },
      basic: {
        width: '32px',
        height: '32px',
        fontSize: '12px',
      },
      middle: {
        width: '40px',
        height: '40px',
        fontSize: '14px',
      },
      large: {
        width: '64px',
        height: '64px',
        fontSize: '24px',
      },
      xlarge: {
        width: '90px',
        height: '90px',
        fontSize: '36px',
      },
    },
  })}
  ${variant({
    variants: {
      circle: {
        borderRadius: '100%',
      },
      square: {
        borderRadius: 0,
      },
    },
  })};
`;

const Avatar = React.forwardRef(
  ({ src, size, variant, children: childrenFromProp, alt, ...others }, ref) => {
    let children = null;
    const theme = useTheme();
    const _classNames = useClassNames({ size, variant, ...others });
    const loaded = useLoaded({ src });
    const hasImg = !!src;
    const hasImgNotFailing = hasImg && loaded !== 'error';
    if (hasImgNotFailing) {
      children = <AvatarImage className={_classNames.img} alt={alt} src={src} />;
    } else if (childrenFromProp !== null) {
      children = childrenFromProp;
    }

    return (
      <AvatarRoot
        className={_classNames.root}
        variant={variant}
        theme={theme}
        size={size}
        ref={ref}
      >
        {children}
      </AvatarRoot>
    );
  },
);

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  variant: PropTypes.oneOf(['circle', 'square']),
  src: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'basic', 'middle', 'large', 'xlarge']),
    PropTypes.number,
  ]),
  children: PropTypes.node,
};

Avatar.defaultProps = {
  variant: 'circle',
  size: 'large',
};

export default Avatar;
