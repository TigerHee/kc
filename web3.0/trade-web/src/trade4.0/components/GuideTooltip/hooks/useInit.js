/*
 * owner: borden@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { useEffect, useRef, useState } from 'react';
import guideQueue from '../guideQueue';

export default function useInitGuideTooltip() {
  const dispatch = useDispatch();
  const timer = useRef(null);
  // 获取当前顶飘是否展示的状态（null为未请求接口。false为不加载或已关闭顶飘，true为显示顶飘），添加 enable 依赖，当 enable 变化时重新渲染 引导弹窗
  const enable = useSelector((s) => s.$header_header?.isShowRestrictNotice);
  const [prevEnable, setPrevEnable] = useState(null);

  const updateSetting = (activeGuideSequence) => {
    dispatch({
      type: 'setting/update',
      payload: {
        activeGuideSequence,
      },
    });
  };

  const setTimer = (sequence) => {
    timer.current = setTimeout(() => {
      updateSetting(sequence);
    }, 500);
  };

  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = null;
    updateSetting(undefined);
  };

  useEffect(() => {
    if (timer.current) {
      clearTimer();
    }

    if (enable === null || enable === undefined) {
      updateSetting(guideQueue.getCurrentSequence());
    } else if (enable === true && prevEnable === null) {
      updateSetting(undefined);
      setTimer(guideQueue.getCurrentSequence());
    } else if (enable === false && prevEnable === true) {
      updateSetting(undefined);
      setTimer(guideQueue.getCurrentSequence());
    }

    setPrevEnable(enable);
  }, [enable]);

  useEffect(() => {
    return clearTimer;
  }, []);
}
