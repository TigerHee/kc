/**
 * Owner: victor.ren@kupotech.com
 */
/* eslint-disable no-useless-return */
import React from 'react';
import { ICCloseFilled } from '@kux/icons';
import classNames from 'clsx';
import useTheme from 'hooks/useTheme';
import KEYCODE from 'utils/keyCode';
import resolveOnChange from 'utils/resolveOnChange';
import useForkRef from 'hooks/useForkRef';
import useMergedState from 'hooks/useMergedState';
import { composeClassNames } from 'styles/index';
import Box from '../Box';
import {
  ClearIconContainer,
  InputContainer,
  StyledInput,
  SuffixContainer,
  AddonContainer,
  LabelContainer,
  Divider,
  LabelFieldSet,
  LabelLegend,
} from './StyledComps';
import getInputClassName from './classNames';

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return String(value);
}

function handlePlaceholder(placeholder, label, shrink) {
  if ((label && shrink) || !label) return placeholder;
}

const preSize = {
  mini: 'small',
  basic: 'middle',
  large: 'large',
  xlarge: 'xlarge',
};

const useClassNames = (state) => {
  const { classNames: classNamesFromProps, size, disabled, error, isFocus } = state;
  const slots = {
    root: [
      'container',
      size && `${size}Container`,
      disabled && 'disabledContainer',
      error && `errorContainer`,
      isFocus && `focus`,
    ].filter(Boolean),
    input: ['input', size && `${size}Input`, disabled && 'disabled', error && 'error'].filter(
      Boolean,
    ),
    clearIcon: ['clearIcon'],
    addonBefore: ['addonBefore'],
    addonAfter: ['addonAfter'],
    prefix: ['prefix'],
    suffix: ['suffix'],
  };
  return composeClassNames(slots, getInputClassName, classNamesFromProps);
};

const InputBase = (
  {
    size,
    onChange,
    placeholder,
    error = false,
    allowClear = false,
    type = 'text',
    addonAfter,
    addonBefore,
    prefix,
    suffix,
    classNames: classNamesFromProps = {},
    value,
    defaultValue,
    onBlur,
    onFocus,
    disabled,
    onEnterPress,
    onKeyDown,
    onKeyUp,
    label,
    labelProps = {},
    autoComplete = 'off',
    maxRows,
    minRows,
    className,
    textareaProps,
    ...rest
  },
  ref,
) => {
  size = preSize[size] || size;

  const theme = useTheme();

  const [innerValue, setInnerValue] = useMergedState(defaultValue, {
    value,
  });

  const containerRef = React.useRef();
  const inputRef = React.useRef(null);
  const handleIutRef = useForkRef(inputRef, ref);
  const [innerType, setInnerType] = React.useState(type);
  const [isFocus, setIsFocus] = React.useState(false);

  const _classNames = useClassNames({
    size,
    classNames: classNamesFromProps,
    disabled,
    error,
    isFocus,
  });

  const removePasswordTimeoutRef = React.useRef([]);

  const removePasswordTimeout = () => {
    removePasswordTimeoutRef.current.push(
      window.setTimeout(() => {
        if (
          inputRef?.current &&
          inputRef?.current?.getAttribute('type') === 'password' &&
          inputRef?.current?.hasAttribute('value')
        ) {
          inputRef?.current?.removeAttribute('value');
        }
      }),
    );
  };

  React.useEffect(() => {
    removePasswordTimeout();
    return () => removePasswordTimeoutRef?.current?.forEach((item) => window.clearTimeout(item));
  }, []);

  const handleChange = (event) => {
    if (value === undefined) {
      setInnerValue(event?.target?.value);
    }
    if (inputRef.current) {
      resolveOnChange(inputRef.current, event, onChange);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReset = (event) => {
    setInnerValue('');
    inputRef?.current?.focus();
    if (inputRef.current) {
      resolveOnChange(inputRef.current, event, onChange);
    }
  };

  const clearIconNode = React.useMemo(() => {
    const fontSize = size === 'small' ? 12 : size === 'large' || size === 'xlarge' ? 18 : 15;
    return innerValue && !disabled ? (
      <ClearIconContainer
        fontSize={fontSize}
        className={classNames(classNamesFromProps.clearIcon, _classNames.clearIcon)}
        onContextMenu={(e) => e.preventDefault()}
        theme={theme}
        onClick={handleReset}
      >
        <ICCloseFilled size={fontSize} color={theme.colors.icon40} />
      </ClearIconContainer>
    ) : null;
  }, [
    size,
    innerValue,
    disabled,
    classNamesFromProps.clearIcon,
    _classNames.clearIcon,
    theme,
    handleReset,
  ]);

  const handleKeyDown = (event) => {
    if (onEnterPress && event.keyCode === KEYCODE.ENTER) {
      onEnterPress(event);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleKeyUp = (event) => {
    if (onKeyUp) {
      onKeyUp(event);
    }
  };

  const onInputMouseDown = (event) => {
    if (containerRef.current?.contains(event.target)) {
      inputRef.current.focus();
    }
  };

  const handleBlur = (event) => {
    removePasswordTimeout();
    setIsFocus(false);
    onBlur?.(event);
  };

  const handleFocus = (event) => {
    removePasswordTimeout();
    setIsFocus(true);
    onFocus?.(event);
  };

  React.useEffect(() => {
    setIsFocus((prev) => (prev && disabled ? false : prev));
  }, [disabled]);

  React.useEffect(() => {
    setInnerType(type);
  }, [type]);

  const showRightOperation = allowClear || suffix;

  const shrink =
    isFocus ||
    fixControlledValue(innerValue) ||
    labelProps.shrink ||
    !!addonBefore ||
    prefix ||
    false;

  const _placeholder = handlePlaceholder(placeholder, label, shrink);

  return (
    <InputContainer
      size={size}
      isFocus={isFocus}
      error={error}
      className={classNames(classNamesFromProps.container, _classNames.root, className)}
      theme={theme}
      disabled={disabled}
      onMouseDown={onInputMouseDown}
      {...rest}
    >
      {addonBefore ? (
        <>
          <AddonContainer className={_classNames.addonBefore}>{addonBefore}</AddonContainer>
          <Divider type="vertical" />
        </>
      ) : null}
      {prefix ? (
        <SuffixContainer className={_classNames.prefix} theme={theme} size={size} prefix>
          {prefix}
        </SuffixContainer>
      ) : null}
      {label ? (
        <LabelContainer
          theme={theme}
          disabled={disabled}
          isFocus={isFocus}
          error={error}
          value={fixControlledValue(innerValue)}
          size={size}
          shrink={shrink}
          className={labelProps.className}
          style={labelProps.style}
        >
          {label}
        </LabelContainer>
      ) : null}
      <StyledInput
        ref={handleIutRef}
        theme={theme}
        size={size}
        placeholder={_placeholder}
        error={error}
        type={innerType}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={fixControlledValue(innerValue)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={classNames(classNamesFromProps.input, _classNames.input)}
        autoComplete={autoComplete}
        maxRows={maxRows}
        minRows={minRows}
        {...textareaProps}
      />
      {showRightOperation ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          {allowClear ? clearIconNode : null}
          {suffix ? (
            <>
              <Divider theme={theme} type="vertical" show={allowClear} />
              <SuffixContainer className={_classNames.suffix} theme={theme} size={size}>
                {suffix}
              </SuffixContainer>
            </>
          ) : null}
        </Box>
      ) : null}
      {addonAfter ? (
        <>
          <Divider theme={theme} type="vertical" show={suffix || allowClear} />
          <AddonContainer className={_classNames.addonAfter}>{addonAfter}</AddonContainer>
        </>
      ) : null}

      <LabelFieldSet theme={theme} error={error} isFocus={isFocus}>
        <LabelLegend shrink={shrink} size={size} label={label}>
          {label}
        </LabelLegend>
      </LabelFieldSet>
    </InputContainer>
  );
};

const TextArea = React.forwardRef(InputBase);

TextArea.defaultProps = {
  size: 'xlarge',
};

export default TextArea;
