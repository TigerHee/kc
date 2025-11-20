/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from '@kux/mui';
import EventEmitter from '@tools/EventEmitter';
import { isEqual, isNil } from 'lodash';
import { SEND_CHANNELS } from '../constants';
import { sendValidationCode } from '../services';
import * as sensors from '../utils/sensors';
import { nextSecond } from '../utils/clock';

const emitter = new EventEmitter();

/**
 * 倒计时缓存
 * 不放 store 避免全局更新
 */
const CD_MAP = {
  // operationId 为key，记录计数（count）和状态（done）
  // [operationId]: { done: boolean, value: number }
};
const set = (operationId, state = {}) => {
  const { done = true, value = 0 } = state;
  CD_MAP[operationId] = { done, value };
  emitter.emit(operationId, CD_MAP[operationId]);
};
const get = (operationId) => CD_MAP[operationId];
/** 计时开始函数 */
const start = async (operationId, _count) => {
  let count = isNil(_count) ? 60 : _count;
  const cd = CD_MAP[operationId];
  if (cd?.done === false) {
    // 有 done 且为 false，计时中，不需要重新计时
    return;
  }
  do {
    set(operationId, { done: count === 0, value: count });
    // eslint-disable-next-line no-await-in-loop
    await nextSecond();
    count--;
  } while (count >= 0);
};

/**
 * 发送验证码
 * @param operationId 操作id，记录同一次验证操作
 * @param bizType 业务场景枚举
 * @param transactionId 后端需要的id，关联同一次验证的所有请求
 * @param sendChannel 消息通道
 */
export default function useSendCode({ operationId, bizType, transactionId, sendChannel }) {
  // 全部计时的状态记录在模块内，通过 operationId 记录同一次验证的状态
  // 场景1: 【手机验证码-发送】和【手机验证码不可用-发送语音短信】共享倒计时
  // 场景2: 来回切换验证方案时，保证倒计时不会因组件销毁而停止
  const [cd, setCd] = useState(get(operationId));
  const { message } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const isFirst = useMemo(() => !cd, [cd]); // 首次发送
  const count = useMemo(() => cd?.value ?? 0, [cd]);

  useEffect(() => {
    // 从 CD_MAP 获取状态，并监听
    const handleChange = (value) => {
      if (!isEqual(value, cd)) {
        setCd(value);
      }
    };
    emitter.on(operationId, handleChange);
    return () => emitter.off(operationId, handleChange);
  }, [operationId, cd]);

  const sendCode = useCallback(async () => {
    if (loading || count > 0) {
      return;
    }
    let success = true;
    try {
      setLoading(true);
      const { data, code, msg } = await sendValidationCode({ bizType, sendChannel, transactionId });
      if (code !== '200') {
        throw new Error(msg);
      }
      success = true;
      start(operationId, data?.retryAfterSeconds);
    } catch (err) {
      set(operationId, { done: true, value: 0 });
      message.error(err.msg || err.message);
      success = false;
    } finally {
      setLoading(false);
      const sensorSendCode =
        sendChannel === SEND_CHANNELS.EMAIL ? sensors.sendEmailCode : sensors.sendPhoneCode;
      sensorSendCode({ bizType, transactionId, result: success });
    }
  }, [loading, count]);

  return { loading, count, isFirst, sendCode };
}
