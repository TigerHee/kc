/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import useMergedState from 'hooks/useMergedState';
import useEventCallback from 'hooks/useEventCallback';
import useForkRef from 'hooks/useForkRef';
import classNames from 'clsx';
import {
  ICTriangleTopOutlined,
  ICTriangleBottomOutlined,
  ICPlusOutlined,
  ICSubOutlined,
} from '@kux/icons';
import Decimal from 'decimal.js';
import { composeClassNames } from 'styles/index';
import getInputNumberClassName from './classNames';
import {
  Root,
  Input,
  Controls,
  ControlItem,
  Unit,
  ControlsRoot,
  LabelContainer,
  InputAdd,
  InputSub,
  LabelFieldSet,
  LabelLegend,
} from './StyledComps';

const numberFixed = (v, decimal, round = Decimal.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Decimal(stringV).toFixed(decimal, round);
};

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return String(value);
}

function handlePlaceholder(placeholder, label, shrink) {
  if ((label && shrink) || !label) return placeholder;
}

const useClassNames = (state) => {
  const { classNames: classNamesFromProps, size, error } = state;
  const slots = {
    container: ['container', size && `${size}Container`, error && `errorContainer`],
    unit: ['unit'],
    controlsRoot: ['controlsRoot'],
    controls: ['controls'],
    up: ['controlUp'],
    down: ['controlDown'],
    input: ['input'],
  };
  return composeClassNames(slots, getInputNumberClassName, classNamesFromProps);
};

const InputNumber = React.forwardRef((props, ref) => {
  const {
    size,
    onChange,
    onBlur,
    onFocus,
    disabled,
    onEnterPress,
    onKeyDown,
    inputRef: inputRefFromProp,
    placeholder,
    name,
    step,
    error,
    unit,
    autoFixPrecision,
    precision,
    controls,
    onClick,
    min,
    max,
    className,
    value: valueFromProp,
    defaultValue: defaultValueFromProp,
    label,
    labelProps = {},
    controlExpand,
    variant,
    ...others
  } = props;
  const theme = useTheme();
  const inputRef = React.useRef(null);
  const handleInputRef = useForkRef(inputRef, inputRefFromProp);
  const [innerValue, setInnerValue] = useMergedState(defaultValueFromProp, {
    value: valueFromProp,
  });
  const [focused, setFocused] = React.useState(false);

  const innerStep = typeof +step === 'number' && step > 0 ? +step : 1;

  React.useEffect(() => {
    if (disabled && focused) {
      setFocused(false);
      onBlur?.();
    }
  }, [disabled, focused, onBlur]);

  const triggerChange = (v) => {
    if (valueFromProp === undefined) {
      setInnerValue(v);
    }

    if (onChange) {
      onChange?.(v);
    }
  };

  const mateDecimal = (value) => {
    if (value) {
      if (typeof min === 'number') {
        value = Decimal.max(min, value);
      }
      if (typeof max === 'number') {
        value = Decimal.min(max, value);
      }
      value = value.toFixed();
      return value;
    }
  };

  const handleChange = (event) => {
    let val = event?.target?.value?.trim();
    // 把句号转为数字点
    val = String(val).replace(/。/g, '.');
    if (val.length === 0) {
      triggerChange(null);
      return;
    }

    if (/^(-|\+)?\d*(\.\d*)?$/.test(val)) {
      triggerChange(val);
    }
  };

  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    try {
      let val = event?.target?.value;
      if (autoFixPrecision && !isNaN(Number(val))) {
        // 未超过精度无需对精度格式化
        const decimalFraction = val.split('.')[1];
        if (decimalFraction && decimalFraction.length > precision) {
          val = numberFixed(+val, precision);
        }
      }
      val = mateDecimal(val);
      setFocused(false);
      triggerChange(val);
      onBlur?.(event);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = useEventCallback(
    (event) => {
      if (inputRef.current && event.currentTarget === event.target) {
        inputRef.current.focus();
      }
      onClick?.();
    },
    [onClick],
  );

  const handleKeyDown = useEventCallback(
    (event) => {
      if (onEnterPress && event.keyCode === 13) {
        onEnterPress(event);
      }
      onKeyDown?.(event);
    },
    [onKeyDown, onEnterPress],
  );

  const setNum = (dict) => {
    try {
      let result = Decimal.add(+(innerValue || 0), Decimal.mul(dict, innerStep));
      if (!result.isNaN()) {
        result = mateDecimal(result);
        triggerChange(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const commonState = {
    size,
    value: fixControlledValue(innerValue),
    name,
    disabled,
  };

  const _classNames = useClassNames({ ...commonState, error });

  const shrink = focused || fixControlledValue(innerValue) || labelProps.shrink || false;
  const _placeholder = handlePlaceholder(placeholder, label, shrink);

  return (
    <Root
      isFocus={focused}
      size={size}
      error={error}
      disabled={disabled}
      onClick={handleClick}
      theme={theme}
      controls={controls}
      className={classNames(className, _classNames.container)}
      ref={ref}
      controlExpand={controlExpand}
      variant={variant}
      {...others}
    >
      {label ? (
        <LabelContainer
          theme={theme}
          disabled={disabled}
          isFocus={focused}
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
      <Input
        autoComplete="off"
        ref={handleInputRef}
        theme={theme}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        className={_classNames.input}
        placeholder={_placeholder}
        controlExpand={controlExpand}
        {...commonState}
      />
      {unit ? (
        <Unit className={_classNames.unit} theme={theme} size={size}>
          {unit}
        </Unit>
      ) : null}
      {controls ? (
        controlExpand ? (
          <React.Fragment>
            <InputAdd onClick={() => setNum(+1)} size={size}>
              <ICPlusOutlined color={theme.colors.text60} />
            </InputAdd>
            <InputSub onClick={() => setNum(-1)} size={size}>
              <ICSubOutlined color={theme.colors.text60} />
            </InputSub>
          </React.Fragment>
        ) : (
          <ControlsRoot className={_classNames.controlsRoot} size={size}>
            <Controls className={_classNames.controls} size={size}>
              <ControlItem
                className={_classNames.up}
                theme={theme}
                size={size}
                onClick={() => setNum(+1)}
              >
                <ICTriangleTopOutlined size={12} color={theme.colors.icon} />
              </ControlItem>
              <ControlItem
                className={_classNames.down}
                theme={theme}
                size={size}
                onClick={() => setNum(-1)}
              >
                <ICTriangleBottomOutlined size={12} color={theme.colors.icon} />
              </ControlItem>
            </Controls>
          </ControlsRoot>
        )
      ) : null}

      <LabelFieldSet theme={theme} error={error} isFocus={focused} variant={variant}>
        <LabelLegend shrink={shrink} size={size} label={label}>
          {label}
        </LabelLegend>
      </LabelFieldSet>
    </Root>
  );
});

InputNumber.defaultProps = {
  size: 'medium',
  step: 1,
  controls: true,
  autoFixPrecision: true,
  precision: 8,
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  variant: 'default',
};

InputNumber.propTypes = {
  // 携带的单位
  unit: PropTypes.node,
  // 尺寸
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  // 初始值
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // 当前值
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // 每次改变步数，可以为小数
  step: PropTypes.number,
  // 变化回调
  onChange: PropTypes.func,
  // 失焦回调
  onBlur: PropTypes.func,
  // 是否自动格式化精度
  autoFixPrecision: PropTypes.bool,
  // 是否使用控制按钮
  controls: PropTypes.bool,
  // 精度
  precision: PropTypes.number,

  // 最小值
  min: PropTypes.number,

  // 最大值
  max: PropTypes.number,

  // label
  label: PropTypes.string,

  // 控制器类型
  controlExpand: PropTypes.bool,

  variant: PropTypes.oneOf(['default', 'filled']),
};

InputNumber.displayName = 'InputNumber';

export default InputNumber;
