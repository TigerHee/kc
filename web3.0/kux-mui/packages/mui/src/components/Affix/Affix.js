/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { on, off } from 'utils/dom';
import { composeClassNames } from 'styles/index';
import getAffixClassName from './classNames';
import { getTargetRect, getFixedTop, getFixedBottom } from './aux';

const useClassNames = (state) => {
  const { classNames: classNamesFromState } = state;
  const slots = {
    root: ['root'],
    affix: ['affix'],
    placeholder: ['placeholder'],
  };

  return composeClassNames(slots, getAffixClassName, classNamesFromState);
};

const Affix = ({ target, children, offsetTop, offsetBottom, onChange, ...others }) => {
  const fixedNode = React.useRef(null);

  const placeholderNode = React.useRef(null);

  const [affixStyle, setAffixStyle] = React.useState({});

  const [placeholderStyle, setPlaceholderStyle] = React.useState({});

  const [affix, setAffix] = React.useState(false);

  const elementTarget = target ? target() : window;

  const _className = useClassNames({ ...others });

  useEffect(() => {
    const measure = () => {
      if (!elementTarget) {
        return;
      }
      const targetRect = getTargetRect(elementTarget);
      const placeholderReact = getTargetRect(placeholderNode.current);
      const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);

      const fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom);
      let newAffixStyle = {};
      let newPlaceholderStyle = {};
      if (fixedTop !== undefined) {
        newAffixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderReact.width,
          height: placeholderReact.height,
        };
        newPlaceholderStyle = {
          width: placeholderReact.width,
          height: placeholderReact.height,
        };
      } else if (fixedBottom !== undefined) {
        newAffixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderReact.width,
          height: placeholderReact.height,
        };
        newPlaceholderStyle = {
          width: placeholderReact.width,
          height: placeholderReact.height,
        };
      } else {
        newAffixStyle = undefined;
        newPlaceholderStyle = undefined;
      }
      const _affix = !!newAffixStyle;

      if (onChange && _affix !== affix) {
        onChange(_affix);
      }
      setAffix(_affix);
      setAffixStyle(newAffixStyle);
      setPlaceholderStyle(newPlaceholderStyle);
    };
    on(elementTarget, 'scroll', measure);
    on(elementTarget, 'resize', measure);
    setTimeout(() => {
      measure();
    });
    return () => {
      off(elementTarget, 'scroll', measure);
      off(elementTarget, 'resize', measure);
    };
  }, [elementTarget, affix, offsetTop, offsetBottom, onChange]);

  return (
    <div className={_className.root} ref={placeholderNode}>
      {affixStyle && (
        <div aria-hidden="true" className={_className.placeholder} style={placeholderStyle} />
      )}
      <div className={_className.affix} ref={fixedNode} style={affixStyle}>
        {children}
      </div>
    </div>
  );
};

Affix.propTypes = {
  offsetTop: PropTypes.number,
  offsetBottom: PropTypes.number,
  target: PropTypes.func,
  onChange: PropTypes.func,
};

Affix.defaultProps = {
  offsetTop: 0,
};

export default Affix;
