/**
 * Owner: garuda@kupotech.com
 * 自定义 Number Input 组件，支持千分位输入（删除支持）
 * TIPS: 后续可能需要对不同的语言格式进行处理
 */
import React from 'react';

import clsx from 'clsx';
import Decimal from 'decimal.js';
import { isFunction, get } from 'lodash';
// import { thousandPointed } from '@/utils/format';

import Box from '@mui/Box';
import Input from '@mui/Input';

import { styled, colors, fx } from '@/style/emotion';

import PlusMinus from './PlusMinus';

// const endZeroRegexp = /0*$/;
// const startZeroRegexp = /^0+(?=[1-9])/;

// let fromDeleteKey = false;

const StyledInput = styled(Input)`
  padding-right: 4px;
  .KuxInput-label {
    color: ${(props) => (props.isFocus ? colors(props, 'primary') : colors(props, 'text40'))};
  }
  &.KuxInput-error .KuxInput-label {
    ${(props) => fx.color(props, 'secondary')}
  }
`;

const ErrorTipsSpan = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.secondary};
`;

const NumberInput = React.forwardRef(
  (
    {
      onChange,
      onFocus,
      onPlus,
      onMinus,
      onBlur,
      step,
      places,
      useTool = false,
      variant = 'filled',
      size = 'medium',
      disabled,
      addOrSubStep,
      isAddOrSubTriggerChange = true, // 加减按钮的时候是否触发change事件
      footer,
      className = '',
      value,
      strictReg = false, // 是否严格校验
      ...props
    },
    ref,
  ) => {
    // 为了每次input都手动设置selectionStart, selectionEnd pos 状态必须为引用类型
    // const [pos, setPos] = React.useState({ start: 0, end: 0 });
    const [isFocus, setFocus] = React.useState(false);

    const textFieldRef = React.useRef(null);

    const stepDecimal = React.useMemo(() => {
      if (places) {
        return new Decimal(10).pow(-places);
      }
      return new Decimal(step || 0);
    }, [places, step]);

    const addOrSubStepDecimal = React.useMemo(() => {
      if (addOrSubStep) {
        return new Decimal(addOrSubStep || 0);
      }
      return stepDecimal;
    }, [addOrSubStep, stepDecimal]);

    const focusInput = React.useCallback(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        setFocus(true);
      }
    }, []);

    // const value = React.useMemo(() => {
    //   return props.value || '';
    // }, [props.value]);

    // const endZeros = React.useMemo(() => {
    //   const matches = stepDecimal.toString().match(endZeroRegexp);

    //   return matches ? matches[0] : '';
    // }, [stepDecimal]);

    // const disabledPos = React.useMemo(() => {
    //   // fix: 处理千分位的位数
    //   const nextPos = value.length - endZeros.length - Math.floor(endZeros.length / 3);
    //   return nextPos < 0 ? 0 : nextPos;
    // }, [value, endZeros]);

    // React.useEffect(() => {
    //   const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    //   if (isSafari) {
    //     // Safari浏览器在focus时才处理
    //     const element = document.activeElement;
    //     if (textFieldRef.current === element) {
    //       textFieldRef.current.selectionStart = pos.start < 0 ? 0 : pos.start;
    //       textFieldRef.current.selectionEnd = pos.end > disabledPos ? disabledPos : pos.end;
    //     }
    //   } else {
    //     textFieldRef.current.selectionStart = pos.start < 0 ? 0 : pos.start;
    //     textFieldRef.current.selectionEnd = pos.end > disabledPos ? disabledPos : pos.end;
    //   }
    // }, [pos, disabledPos]);

    const regexp = React.useMemo(() => {
      if (stepDecimal.isInt()) {
        return strictReg ? /^(0|[1-9]\d*)$/ : /(^$)|^([0-9]*)$/;
      } else {
        const _places = stepDecimal.dp();
        return strictReg
          ? new RegExp(`^(0|[1-9]\\d*)(\\.[0-9]{0,${_places}})?$`)
          : new RegExp(`(^$)|^([0-9]*)(\\.[0-9]{0,${_places}})?$`);
      }
    }, [stepDecimal, strictReg]);

    const handleFocus = React.useCallback(
      (e) => {
        if (e.target.selectionStart !== e.target.selectionEnd) {
          // setPos({ start: disabledPos, end: disabledPos });
          e.preventDefault();
        }
        if (isFunction(onFocus)) {
          onFocus(e);
        }
        setFocus(true);
      },
      [
        onFocus,
        //  disabledPos
      ],
    );

    const handleBlur = React.useCallback(
      (e) => {
        if (isFunction(onBlur)) {
          onBlur(e);
        }
        setFocus(false);
      },
      [onBlur],
    );

    // 千分位输入，屏蔽
    // const triggerChange = React.useCallback(
    //   (v) => {
    //     let splitValue = v.replace(/,/g, '');
    //     let nextPos = pos.end;
    //     if (isFunction(onChange) && regexp.test(splitValue)) {
    //       splitValue = splitValue.replace(startZeroRegexp, '');

    //       if (splitValue && !Decimal(splitValue).mod(stepDecimal).eq(0)) {
    //         const originValue = splitValue;
    //         splitValue = Decimal(splitValue).toNearest(stepDecimal).toString();
    //         // 修复第一次输入时为0bug, 若计算为0，则按照 a * stepDecimal
    //         if (+splitValue === 0) {
    //           if (originValue < 10) {
    //             splitValue = Decimal(originValue).mul(stepDecimal).toString();
    //           }
    //         }
    //       }

    //       if (splitValue === '0' && endZeros) {
    //         splitValue = endZeros;
    //         nextPos = 0;
    //       } else if (splitValue === endZeros) {
    //         splitValue = '';
    //         nextPos = 0;
    //       } else {
    //         const nextValue = splitValue; // thousandPointed(splitValue, true);

    //         if (v.length > value.length) {
    //           // nextValue长度大于valu，证明为有效输入，设置正确的pos
    //           // 否则为无效输入，pos保持不变
    //           if (nextValue.length > value.length) {
    //             nextPos = nextPos + nextValue.length - value.length;
    //           }
    //         }

    //         if (v.length < value.length) {
    //           if (nextValue.length === value.length && fromDeleteKey) {
    //             nextPos -= 1;
    //           } else {
    //             nextPos = nextPos - value.length + nextValue.length;
    //           }
    //         }
    //       }

    //       // nextPos = nextPos < 0 ? 0 : nextPos;
    //       // nextPos = nextPos > disabledPos ? disabledPos : nextPos;

    //       fromDeleteKey = false;

    //       setPos({ start: nextPos, end: nextPos });
    //       onChange(splitValue);
    //     } else {
    //       setPos({ start: pos.start, end: pos.end });
    //     }
    //   },
    //   [onChange, regexp, endZeros, value, pos, stepDecimal],
    // );

    const triggerChange = React.useCallback(
      (v) => {
        const isEmpty = v === '';
        console.log('v --->', v, regexp.test(v));
        if (isFunction(onChange)) {
          if (regexp.test(v) || isEmpty) {
            console.log('v1 --->', v);
            onChange(v);
          } else {
            onChange(value === undefined ? '' : value);
          }
        }
      },
      [onChange, regexp, value],
    );

    const handleChange = React.useCallback(
      (e) => {
        triggerChange(e.target.value, e);
      },
      [triggerChange],
    );

    // const handleKeyDown = React.useCallback(
    //   (e) => {
    //     switch (e.keyCode) {
    //       case 8:
    //         fromDeleteKey = true;
    //         break;
    //       case 39: // right
    //         if (e.target.selectionEnd >= disabledPos) {
    //           setPos({ start: disabledPos, end: disabledPos });
    //         } else {
    //           setPos({ start: e.target.selectionEnd + 1, end: e.target.selectionStart + 1 });
    //         }
    //         e.preventDefault();
    //         break;
    //       case 40: // down
    //         setPos({ start: disabledPos, end: disabledPos });
    //         e.preventDefault();
    //         break;
    //       case 37: // left
    //         setPos({
    //           start: e.target.selectionStart - 1 < 0 ? 0 : e.target.selectionStart - 1,
    //           end: e.target.selectionStart - 1 < 0 ? 0 : e.target.selectionStart - 1,
    //         });
    //         e.preventDefault();
    //         break;
    //       case 38: // down
    //         setPos({ start: 0, end: 0 });
    //         e.preventDefault();
    //         break;
    //       default:
    //         break;
    //     }
    //   },
    //   [disabledPos],
    // );

    // const handleMouseUp = React.useCallback(
    //   (e) => {
    //     console.log(e.target.selectionEnd, e.target.selectionStart);
    //     if (e.target.selectionEnd === e.target.selectionStart) {
    //       let nextPos = e.target.selectionStart;
    //       if (nextPos > disabledPos) {
    //         nextPos = disabledPos;
    //       }

    //       setPos({ start: nextPos, end: nextPos });
    //     } else {
    //       const nextEndPos =
    //         e.target.selectionEnd > disabledPos ? disabledPos : e.target.selectionEnd;
    //       setPos({ start: e.target.selectionStart, end: nextEndPos });
    //     }
    //   },
    //   [disabledPos],
    // );

    const handlePlus = React.useCallback(() => {
      if (disabled) return;
      const valuePlused = Decimal(Number(value || 0))
        .add(addOrSubStepDecimal)
        .toFixed()
        .toString();

      isAddOrSubTriggerChange && triggerChange(valuePlused);
      if (onPlus) {
        onPlus(valuePlused);
      }
      focusInput();
    }, [
      disabled,
      value,
      addOrSubStepDecimal,
      isAddOrSubTriggerChange,
      triggerChange,
      onPlus,
      focusInput,
    ]);

    const handleMinus = React.useCallback(() => {
      if (disabled) return;
      const valueMinused = Decimal(Number(value || 0))
        .sub(addOrSubStepDecimal)
        .toFixed()
        .toString();

      isAddOrSubTriggerChange && triggerChange(valueMinused);
      if (onMinus) {
        onMinus(valueMinused);
      }
      focusInput();
    }, [
      disabled,
      value,
      addOrSubStepDecimal,
      isAddOrSubTriggerChange,
      triggerChange,
      onMinus,
      focusInput,
    ]);

    const AdornedEnd = React.useMemo(() => {
      const propsEndAdornment = get(props, 'addonAfter');
      const unit = get(props, 'unit');
      if (useTool) {
        return (
          <Box alignItems="center" display="flex" alignSelf="stretch">
            {unit}
            {propsEndAdornment}
            <PlusMinus size={size} disabled={disabled} onPlus={handlePlus} onMinus={handleMinus} />
          </Box>
        );
      }

      return (
        <>
          {unit}
          {propsEndAdornment}
        </>
      );
    }, [props, useTool, size, disabled, handlePlus, handleMinus]);

    React.useImperativeHandle(ref, () => textFieldRef);

    return (
      <>
        <StyledInput
          {...props}
          isFocus={isFocus}
          className={clsx('number-input', { 'number-input-focus': isFocus }, className)}
          disabled={disabled}
          useTool={useTool}
          variant={variant}
          size={size}
          value={value}
          ref={textFieldRef}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // onMouseUp={handleMouseUp}
          addonAfter={AdornedEnd}
        />
        {footer || null}
        <ErrorTipsSpan>{props.helperText}</ErrorTipsSpan>
      </>
    );
  },
);

export default React.memo(NumberInput);
