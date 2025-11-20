/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ICEyeCloseOutlined, ICEyeOpenOutlined, ICCloseFilled } from '@kux/icons';
import clsx from 'clsx';
import useTheme from 'hooks/useTheme';
import KEYCODE from 'utils/keyCode';
import resolveOnChange from 'utils/resolveOnChange';
import useForkRef from 'hooks/useForkRef';
import useMergedState from 'hooks/useMergedState';
import Box from '../Box';
import {
  ClearIconContainer,
  InputContainer,
  ShowPwdIconContainer,
  StyledInput,
  SuffixContainer,
  AddonContainer,
  LabelContainer,
  Divider,
  LabelFieldSet,
  LabelLegend,
} from './kux';
import useClassNames from './useClassNames';

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
  basic: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};

const Input = React.forwardRef(
  (
    {
      size,
      onChange,
      placeholder,
      error,
      allowClear,
      type,
      addonAfter,
      addonBefore,
      prefix,
      suffix,
      className,
      value,
      defaultValue,
      onBlur,
      onFocus,
      disabled,
      onEnterPress,
      onKeyDown,
      onKeyUp,
      label,
      labelProps,
      autoComplete,
      variant,
      inputProps,
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
    const isPwd = type === 'password';
    const [isFocus, setIsFocus] = React.useState(false);

    const _classNames = useClassNames({ size, disabled, error, type, isFocus });

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

    const showPwdIconNode = React.useMemo(() => {
      const fontSize = size === 'small' ? 12 : size === 'large' || size === 'xlarge' ? 24 : 20;
      return (
        <ShowPwdIconContainer
          theme={theme}
          className={_classNames.togglePwdIcon}
          onClick={(e) => {
            e.stopPropagation();
            setInnerType(innerType === 'password' ? 'text' : 'password');
          }}
        >
          {innerType === 'password' ? (
            <ICEyeCloseOutlined size={fontSize} color={theme.colors.text} />
          ) : (
            <ICEyeOpenOutlined size={fontSize} color={theme.colors.text} />
          )}
        </ShowPwdIconContainer>
      );
    }, [size, theme, _classNames.togglePwdIcon, innerType]);

    const clearIconNode = React.useMemo(() => {
      const fontSizeMap = {
        xsmall: 12,
        small: 12,
        large: 18,
        xlarge: 18,
        default: 15,
      };
      const fontSize = fontSizeMap[size] ? fontSizeMap[size] : fontSizeMap.default;
      return innerValue && !disabled ? (
        <ClearIconContainer
          fontSize={fontSize}
          className={_classNames.clearIcon}
          onContextMenu={(e) => e.preventDefault()}
          theme={theme}
          onClick={handleReset}
        >
          <ICCloseFilled size={fontSize} color={theme.colors.icon40} />
        </ClearIconContainer>
      ) : null;
    }, [size, innerValue, disabled, _classNames.clearIcon, theme, handleReset]);

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

    const showRightOperation = allowClear || isPwd || suffix;

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
        className={clsx(_classNames.root, className)}
        theme={theme}
        disabled={disabled}
        onMouseDown={onInputMouseDown}
        variant={variant}
        {...rest}
      >
        {addonBefore ? (
          <>
            <AddonContainer className={_classNames.addonBefore}>{addonBefore}</AddonContainer>
            <Divider type="vertical" />
          </>
        ) : null}
        {prefix ? (
          <SuffixContainer prefix className={_classNames.prefix} theme={theme} size={size}>
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
            className={clsx(_classNames.label, labelProps.className)}
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
          className={_classNames.input}
          autoComplete={autoComplete}
          {...inputProps}
        />
        {showRightOperation ? (
          <Box
            className={_classNames.suffixWrapper}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {allowClear ? clearIconNode : null}
            {isPwd ? showPwdIconNode : null}
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
        <LabelFieldSet size={size} theme={theme} error={error} isFocus={isFocus} variant={variant}>
          <LabelLegend shrink={shrink} size={size} label={label}>
            {label}
          </LabelLegend>
        </LabelFieldSet>
      </InputContainer>
    );
  },
);

Input.propTypes = {
  variant: PropTypes.oneOf(['default', 'filled']), // 类型
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']), // 尺寸
  placeholder: PropTypes.string,
  error: PropTypes.bool, // 是否显示错误样式
  allowClear: PropTypes.bool, // 允许清除
  type: PropTypes.oneOf(['text', 'password']), // 输入框类型
  addonAfter: PropTypes.node,
  addonBefore: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  label: PropTypes.node,
  labelProps: PropTypes.object, // shrink className style
  autoComplete: PropTypes.string,
  onChange: PropTypes.func, // 输入变更事件
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onEnterPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  inputProps: PropTypes.object,
};

Input.defaultProps = {
  variant: 'default',
  size: 'medium',
  placeholder: '',
  error: false,
  allowClear: false,
  type: 'text',
  addonAfter: null,
  addonBefore: null,
  prefix: null,
  suffix: null,
  disabled: false,
  label: null,
  labelProps: {},
  autoComplete: 'off',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onEnterPress: () => {},
  onKeyDown: () => {},
  onKeyUp: () => {},
  inputProps: {},
};

Input.displayName = 'Input';

export default Input;
