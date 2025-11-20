/**
 * Owner: garuda@kupotech.com
 * 合约下单组件模块入口
 */

import React, { useEffect, useMemo, memo, useCallback } from 'react';

import { event, VERIFY_END_EVENT_NAME } from '../builtinCommon';

import { Verify } from '../builtinComponents';
import { useVerify } from '../config';


const VerifyWrapper = memo(({ children }) => {
  const { hasPwd, isNeedVerify, setIsNeedVerify, checkAfter, setCheckAfter } = useVerify();

  const checkShowVerify = useMemo(() => isNeedVerify && hasPwd, [hasPwd, isNeedVerify]);

  const onFinish = useCallback(({ res }) => {
    if (res?.success) {
      setIsNeedVerify(false);

      if (checkAfter) {
        typeof checkAfter.current === 'function' && checkAfter.current();
        // 清空 checkAfter 值
        setCheckAfter(false);
      }
    }
  }, [checkAfter, setCheckAfter, setIsNeedVerify]);

  useEffect(() => {
    event.on(VERIFY_END_EVENT_NAME, onFinish);
    return () => {
      event.off(VERIFY_END_EVENT_NAME);
    };
  }, [onFinish]);

  return (
    <>
      {checkShowVerify ? <Verify /> : null}
      <div style={{ display: checkShowVerify ? 'none' : 'block' }}>{children}</div>
    </>
  );
});

export default memo(VerifyWrapper);
