/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@kufox/mui';
import storage from '@utils/storage';
import noop from 'lodash/noop';

let timer = null;

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
    countTime = 0,
    countTimeOver = noop,
    loading = false,
    countText,
    countLabel = 's',
    localTimeKey,
    ...other
  } = props;

  const [countTimer, setCountTimer] = useState(countTime);

  const isCount = countTimer > 0;

  useEffect(() => {
    if (countTime.time > 0) {
      setCountTimer(countTime.time);
      clearInterval(timer);
      timer = setInterval(() => {
        setCountTimer((countTimer) => {
          if (countTimer <= 1) {
            clearInterval(timer);
            storage.removeItem(localTimeKey);
            countTimeOver();
            return 0;
          }
          return countTimer - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [countTime]);

  const handleSendCode = () => {
    onChange();
  };

  return (
    <Button
      {...other}
      onClick={handleSendCode}
      variant={variant}
      color="primary"
      disabled={Boolean(disabled) || Boolean(isCount)}
      loading={loading}
    >
      {!loading && isCount ? `${countTimer} ${countLabel || null}` : countText}
    </Button>
  );
}
