/**
 * Owner: harry.lai@kupotech.com
 */
import React, { Suspense, useState, useEffect, useCallback, memo } from 'react';
import useIsH5 from '@/hooks/useIsH5';
import { SurveyShowController } from './util';

const SatisfactionSurveyModal = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-satisfactionSurveyModal' */ '@/pages/Portal/SatisfactionSurvey'
  );
});

/** 满意度调研弹窗挂载入口 此处入口已懒加载处理 */
const SatisfactionSurveyMain = () => {
  const [needLoad, setNeedLoad] = useState(false);
  const isH5 = useIsH5();

  const initNeedLoad = useCallback(() => {
    if (isH5 || needLoad) return;

    SurveyShowController.canShow() && setNeedLoad(true);
  }, [isH5, needLoad]);

  useEffect(() => {
    initNeedLoad();
  }, [initNeedLoad]);

  if (!needLoad) return null;

  return (
    <Suspense fallback={<div />}>
      <SatisfactionSurveyModal />
    </Suspense>
  );
};

export default memo(SatisfactionSurveyMain);
