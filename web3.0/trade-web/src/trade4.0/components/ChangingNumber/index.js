/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { debounce } from 'lodash';
import usePrevious from '@/hooks/common/usePrevious';
import { ChangingWrapper, ChangingBg, ChangingIcon } from './style';
import SvgComponent from '../SvgComponent';
import { useTheme } from '@kux/mui/hooks';

const UP = 'UP';
const DOWN = 'DOWN';

// 非数字 和 . 的替换成空
export const replaceValue = (value) => `${value}`.replace(/[^\d|.]/g, '');

/**
 * ChangingNumber
 */
const ChangingNumber = (props) => {
  const {
    children = null,
    value = null,
    showBgArea = true,
    compare = null,
    showIcon = true,
    iconPlacement = 'left',
    up,
    down,
    ...restProps
  } = props;
  const [status, setStatus] = useState(null);
  const [showBg, setShowBg] = useState(false);

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const resetTsRef = useRef(null);
  const showBgTsRef = useRef(null);

  const prevValue = usePrevious(value);
  const { colors } = useTheme();

  const reset = useCallback(
    debounce(() => {
      if (bgRef.current) {
        setShowBg(false);
      }
      if (resetTsRef.current) {
        clearTimeout(resetTsRef.current);
      }
      resetTsRef.current = setTimeout(() => {
        if (containerRef.current) {
          setStatus(null);
        }
      }, 400);
    }, 400),
    [],
  );

  const clacStatus = useMemo(() => {
    // if (compare) {
    //   prevValue = compare;
    // }

    if (prevValue === value) {
      return null;
    }
    if (replaceValue(prevValue) < replaceValue(value)) {
      return UP;
    }
    return DOWN;
  }, [prevValue, value]);

  const color = useMemo(() => {
    if (status === UP) return up || colors?.primary;
    if (status === DOWN) return down || colors?.secondary;
    return null;
  }, [status, up, down]);

  useEffect(() => {
    if (clacStatus) {
      if (showBgTsRef.current) {
        clearTimeout(showBgTsRef.current);
      }
      showBgTsRef.current = setTimeout(() => {
        setStatus(clacStatus);
        if (showBgArea) {
          setShowBg(true);
        }
      }, 0);
      reset();
    }

    return () => {
      clearTimeout(resetTsRef.current);
      clearTimeout(showBgTsRef.current);
    };
  }, [showBgArea, clacStatus]);

  return (
    <ChangingWrapper ref={containerRef} {...restProps}>
      {showBg && (
        <ChangingBg
          ref={bgRef}
          className={iconPlacement}
          style={{ background: color }}
        />
      )}
      <span style={{ color }}>{children !== null ? children : value}</span>
      <ChangingIcon className={iconPlacement} style={{ color }}>
        {showIcon && status === UP && <SvgComponent fileName="icons" type="trade_arrow_up" />}
        {showIcon && status === DOWN && <SvgComponent fileName="icons" type="trade_arrow_down" />}
      </ChangingIcon>
    </ChangingWrapper>
  );
};

export default memo(ChangingNumber);
