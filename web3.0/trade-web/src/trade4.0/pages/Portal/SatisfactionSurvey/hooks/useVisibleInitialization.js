/**
 * Owner: harry.lai@kupotech.com
 */
import { useCallback, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'dva';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import useIsH5 from '@/hooks/useIsH5';
import { commonSensorsFunc } from '@/meta/sensors';
import { SurveyShowController } from '../util';

/** 初始化调研漏出逻辑hook */
export const useVisibleInitialization = () => {
  const [visible, setVisible] = useState(false);
  const hasPassPlaceOrderCondition = useSelector(
    (state) => state.portal.satisfiedSurveyPlaceOrderCondition,
  );
  const isH5 = useIsH5();

  // 初始化出调研弹窗逻辑
  const initSurveyVisible = useCallback(() => {
    // H5不展示调研
    if (isH5) {
      setVisible(false);
      return;
    }

    // 是否进行过下单条件
    if (!hasPassPlaceOrderCondition) {
      return;
    }

    const canShow = SurveyShowController.canShow();
    setVisible(canShow);
    canShow && commonSensorsFunc(['satisfactionSurvey', 'expose']);
  }, [setVisible, isH5, hasPassPlaceOrderCondition]);

  const closeSurvey = useMemoizedFn(() => setVisible(false));

  useEffect(() => {
    initSurveyVisible();
  }, [initSurveyVisible]);

  return {
    closeSurvey,
    visible,
  };
};
