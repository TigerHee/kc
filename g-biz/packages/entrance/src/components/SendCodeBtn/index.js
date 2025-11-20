/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, styled } from '@kux/mui';
import { ICLoadingOutlined } from '@kux/icons';
import noop from 'lodash/noop';
import delay from 'lodash/delay';
import isFunction from 'lodash/isFunction';

const ExtendButton = styled(Button)`
  height: auto;
  /* margin-top: 16px !important; */
`;

const Text = styled.span`
  font-size: 14px;
  color: ${(props) => (props.isCount ? props.theme.colors.text40 : props.theme.colors.primary)};
`;

const ExtendLoading = styled(ICLoadingOutlined)`
  color: ${(props) => props.theme.colors.primary};
  animation: rotate-ani 2s linear infinite;
  @keyframes rotate-ani {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * @param {onChange} function onChange 回调函数 默认 空函数
 * @param {disabled} Boolean 是否 disable 默认 true
 * @param {countTime} number 倒计时时间 默认 30
 * @param {countTimeOver} function 倒计时结束执行
 * @param {localTimeKey} string 本地的倒计时key
 * @param {countText} string 按钮的文字
 * @param {countLabel} string 倒计时的单位
 */
export default function SendCodeBtn(props = {}) {
  const {
    variant = 'contained',
    onChange = noop,
    disabled = true,
    countTime,
    countTimeOver = noop,
    loading = false,
    countText,
    countLabel = 's',
    onUpdateCountTime = noop,
    ...other
  } = props;
  const [countTimer, setCountTimer] = useState(0);

  const timer = useRef(null); // 倒计时定时器，每个类型使用一个定时器
  const isCount = countTimer > 0;

  const clearTimer = () => {
    if (timer?.current) {
      clearTimeout(timer?.current);
      timer.current = null; // 重置状态
    }
  };

  const startCount = useCallback(
    (seconds) => {
      setCountTimer(seconds);
      if (seconds !== 0) {
        timer.current = delay(() => {
          startCount(seconds - 1);
        }, 1000);
      } else {
        countTimeOver();
        clearTimer();
      }
      if (isFunction(onUpdateCountTime)) {
        onUpdateCountTime(seconds);
      }
    },
    [countTimeOver, onUpdateCountTime],
  );

  useEffect(() => {
    if (!timer?.current && countTime && countTime > 0 && countTimer <= 0) {
      startCount(countTime);
    }
  }, [countTime, countTimer, startCount, timer]);

  // 组件销毁时清除定时器
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const handleSendCode = (e) => {
    // 防止触发父级的的规则校验
    e?.preventDefault();
    e?.stopPropagation();
    onChange();
  };
  return (
    <ExtendButton
      {...other}
      onClick={handleSendCode}
      variant={variant}
      type="primary"
      disabled={Boolean(disabled) || Boolean(isCount)}
    >
      {loading ? (
        <ExtendLoading size="18" />
      ) : isCount ? (
        <Text isCount={isCount}>{`${countTimer}${countLabel || null}`}</Text>
      ) : (
        <Text>{countText}</Text>
      )}
    </ExtendButton>
  );
}
