/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled, { isPropValid } from 'emotion/index';
import { useTheme, useMergedState } from 'hooks/index';
import { composeClassNames } from 'styles/index';
import BaseInput from '../BaseInput';

import getRadioClassName from './className';

const useClassNames = (state) => {
  const { classNames: classNamesFromProps, isButtonType, checked, disabled } = state;
  const slots = {
    radio: [
      'radio',
      isButtonType && 'radio-button',
      checked && `${isButtonType ? 'button-' : ''}checked`,
      disabled && `${isButtonType ? 'button-' : ''}disabled`,
    ],
    input: ['input', isButtonType && 'button-input'],
    inner: ['inner', isButtonType && 'button-inner'],
  };
  return composeClassNames(slots, getRadioClassName, classNamesFromProps);
};

const RadioBaseRoot = styled('span', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ isButtonType, size }) => {
  return {
    ...(isButtonType
      ? {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        '> input': {
          position: 'initial',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        },
      }
      : {
        boxSizing: 'border-box',
        margin: 0,
        listStyle: 'none',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        cursor: 'pointer',
        padding: '1px',
      }),
  };
});

const RadioBaseInner = styled('span', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, checked, isButtonType, size }) => {
  return {
    ...(isButtonType
      ? {}
      : {
        display: 'block',
        boxSizing: 'border-box',
        position: 'relative',
        left: 0,
        top: 0,
        width: '22px',
        height: '22px',
        border: `2px solid ${checked ? theme.colors.primary : theme.colors.icon40}`,
        borderRadius: '100%',
        ...(size === 'small' && {
          width: '18.3px',
          height: '18.3px',
        }),
        '&::after': {
          display: 'block',
          width: '10px',
          height: '10px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: '-5px',
          marginTop: '-5px',
          borderRadius: '100%',
          background: theme.colors.primary,
          content: '""',
          transform: checked ? 'scale(1)' : 'scale(0)',
          opacity: checked ? 1 : 0,
          transition: 'all 0.3s',
          ...(size === 'small' && {
            width: '8.3px',
            height: '8.3px',
            marginLeft: '-4.15px',
            marginTop: '-4.15px',
          })
        },
      }),
  };
});

const RadioBase = React.forwardRef((props, ref) => {
  const { onChange, isButtonType, size, ...others } = props;
  const theme = useTheme();
  const [checked, setChecked] = useMergedState(props.defaultChecked, {
    value: props.checked,
  });

  const handleChange = (event) => {
    const newChecked = event.target.checked;

    if (props.checked === undefined) {
      setChecked(newChecked);
    }
    if (onChange) {
      onChange(event);
    }
  };

  const _classNames = useClassNames({ ...others, isButtonType, checked });

  return (
    <RadioBaseRoot className={_classNames.radio} isButtonType={isButtonType}>
      <BaseInput
        className={_classNames.input}
        {...others}
        ref={ref}
        onChange={handleChange}
        theme={theme}
      />
      <RadioBaseInner
        className={_classNames.inner}
        isButtonType={isButtonType}
        checked={checked}
        theme={theme}
        size={size}
      />
    </RadioBaseRoot>
  );
});

export default RadioBase;
