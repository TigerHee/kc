/*
 * @owner: borden@kupotech.com
 */
import { useRef, useEffect } from 'react';
import { useDispatch } from 'dva';
import { event } from '@/utils/event';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import useSubmitHandle from './useSubmitHandle';
import useTradePwdStatus from './useTradePwdStatus';
import { VERIFY_END_EVENT_NAME } from '../components/Verify';

export default function useSubmitWithVerify({
  orderType,
  submitCallback,
  loadingPrefix = 'loading',
}) {
  const dispatch = useDispatch();
  const orderValues = useRef(null);
  const {
    hasPwd,
    checkVerify,
    isNeedVerify,
    setIsNeedVerify,
  } = useTradePwdStatus();
  const submitHandle = useSubmitHandle({ orderType });

  const showVerify = Boolean(isNeedVerify && hasPwd);

  useEffect(() => {
    if (showVerify) {
      event.on(VERIFY_END_EVENT_NAME, onFinish);
    }
  }, [showVerify, onFinish]);

  const triggerConfirmLoading = (_side, _loading = false) => {
    dispatch({
      type: 'tradeForm/update',
      payload: {
        [`${loadingPrefix}_${_side}`]: _loading,
      },
    });
  };

  const onSubmit = useMemoizedFn(async ({ passVerify, ...otherParams }) => {
    let _isNeedVerify;
    if (passVerify) {
      _isNeedVerify = false;
    } else {
      triggerConfirmLoading(otherParams.side, true);
      _isNeedVerify = await checkVerify(); // -1: 请求异常  true: 需要检测
    }
    if (_isNeedVerify) {
      triggerConfirmLoading(otherParams.side, false);
      orderValues.current = otherParams;
      return false;
    }
    const res = await submitHandle(otherParams);
    if (passVerify && submitCallback) {
      submitCallback(res);
    }
    return res;
  });

  const onFinish = useMemoizedFn(({ res }) => {
    if (res?.success) {
      setIsNeedVerify(false);
      event.off(VERIFY_END_EVENT_NAME);
      // 初次进来后自动校验一次，后续校验在表单提交的时候
      if (orderValues.current) {
        onSubmit({ ...orderValues.current, passVerify: true });
      }
    }
  });

  return {
    hasPwd,
    onSubmit,
    showVerify,
    checkVerify,
    isNeedVerify,
    setIsNeedVerify,
  };
}
