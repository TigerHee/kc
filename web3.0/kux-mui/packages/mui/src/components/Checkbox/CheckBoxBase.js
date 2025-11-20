/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled, { isPropValid } from 'emotion/index';
import useMergedState from 'hooks/useMergedState';
import useTheme from 'hooks/useTheme';
import { variant } from 'styled-system';
import { ICCheckboxArrowOutlined } from '@kux/icons';
import BaseInput from '../BaseInput';

const CheckBoxRoot = styled.span`
  box-sizing: border-box;
  margin: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1;
  vertical-align: middle;
  top: -0.09em;
`;

const CheckBoxInner = styled('span', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, checked, checkedType, size }) => {
  const styles = {
    display: 'block',
    boxSizing: 'border-box',
    position: 'relative',
    left: 0,
    top: 0,

    background: 'transparent',
    border: `2px solid ${theme.colors.icon40}`,
    borderRadius: theme.radius.full,
    ...(checked && {
      background: checkedType === 1 ? theme.colors.text : theme.colors.textPrimary,
      borderColor: checkedType === 1 ? theme.colors.text : theme.colors.textPrimary,
    }),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...variant({
      prop: 'size',
      variants: {
        small: {
          width: '18.3px',
          height: '18.3px',
          '& svg': {
            width: '12px',
            height: '12px',
          }
        },
        basic: {
          width: '20px',
          height: '20px',
          '& svg': {
            width: '14px',
            height: '14px',
          }
        },
        large: {
          width: '22px',
          height: '22px',
          '& svg': {
            width: '16px',
            height: '16px',
          }
        },
      },
    })({ size }),
  };

  return styles;
});

const CheckBoxBase = React.forwardRef((props, ref) => {
  const { onChange, indeterminate, classNames, checkOptions = {}, size = 'small', ...others } = props;
  const theme = useTheme();
  const [checked, setChecked] = useMergedState(props.defaultChecked, {
    value: props.checked,
  });
  const handleChange = (event) => {
    const newChecked = event.target.checked;
    if (!('checked' in props)) {
      setChecked(newChecked);
    }
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <CheckBoxRoot className={classNames.checkbox}>
      <BaseInput
        {...others}
        className={classNames.input}
        ref={ref}
        onChange={handleChange}
        theme={theme}
      />
      <CheckBoxInner
        className={classNames.inner}
        checked={checked}
        indeterminate={indeterminate}
        theme={theme}
        size={size}
        {...checkOptions}
      >
        {checked && <ICCheckboxArrowOutlined color={theme.colors.textEmphasis} />}
      </CheckBoxInner>
    </CheckBoxRoot>
  );
});

export default CheckBoxBase;
