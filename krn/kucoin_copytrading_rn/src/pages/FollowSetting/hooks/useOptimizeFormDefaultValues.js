import {useCallback, useEffect} from 'react';

import {isUndef} from 'utils/helper';
import {DEFAULT_LEVERAGE_VALUE} from '../constant';
import {useGetFormSceneStatus} from './useGetFormSceneStatus';
import {usePullCopyFormConfig} from './usePullCopyFormConfig';

/** 优化适配 表单默认值与动态配置冲突 hook */
export const useOptimizeFormDefaultValues = ({
  fixedAmountFormMethods,
  fixedRateFormMethods,
}) => {
  const {data: formConfigResp} = usePullCopyFormConfig();
  const {isReadonly} = useGetFormSceneStatus();

  const {copyMaxLeverage} = formConfigResp?.data || {};

  /** 调整默认杠杠倍数，解决 后端配置杠杠小于默认值时 取后端杠杠配置覆盖默认值 */
  const optimizeRightDefaultLeverage = useCallback(() => {
    // 只读模式禁止修改默认杠杠倍数
    if (
      isReadonly ||
      isUndef(copyMaxLeverage) ||
      copyMaxLeverage >= DEFAULT_LEVERAGE_VALUE
    ) {
      return;
    }

    fixedAmountFormMethods &&
      fixedAmountFormMethods.setValue('leverage', copyMaxLeverage);
    fixedRateFormMethods &&
      fixedRateFormMethods.setValue('leverage', copyMaxLeverage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyMaxLeverage, isReadonly]);

  useEffect(() => {
    optimizeRightDefaultLeverage();
  }, [optimizeRightDefaultLeverage]);
};
