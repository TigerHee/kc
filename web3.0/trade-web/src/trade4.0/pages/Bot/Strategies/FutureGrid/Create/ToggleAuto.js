/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useCallback } from 'react';
import { useModel } from './model';
import { _t } from 'Bot/utils/lang';
import { numberFixed } from 'Bot/helper';
import { useDispatch } from 'dva';
import ToggleAIParamsButton from 'Bot/components/Common/ToggleAIParamsButton';

const ToggleAutoFillButton = React.memo(({ symbolCode, setRelatedParams, form }) => {
  const {
    commonSetting: { direction, fillAIParamsBtnActive },
    setCommonSetting,
  } = useModel();
  const lockRef = useRef(false);
  const dispatch = useDispatch();
  const toGetAIParams = useCallback(() => {
    lockRef.current = true;
    dispatch({
      type: 'futuregrid/getAIParams',
      payload: {
        symbol: symbolCode,
        direction,
      },
    })
      .then((data) => {
        const { lowerPrice, upperPrice, gridNum, leverage } = data;
        // 设置倍数
        setCommonSetting({ leverage });
        setRelatedParams(data);
        // 设置其他表单
        form.setFieldsValue({
          lowerPrice: numberFixed(lowerPrice),
          upperPrice: numberFixed(upperPrice),
          gridNum,
        });
      })
      .finally(() => {
        lockRef.current = false;
      });
  }, [symbolCode, direction]);

  const toggle = () => {
    if (lockRef.current) return;
    if (!fillAIParamsBtnActive) {
      toGetAIParams();
    } else {
      form.resetFields();
      // 重置依赖参数
      setRelatedParams((e) => {
        return {
          ...e,
          diff: 0,
          feeRatio: 0,
          gridProfitLowerRatio: 0,
          gridProfitUpperRatio: 0,
          minAmount: 0,
          realMinAmount: 0,
          multiplier: 0,
          maxInvestment: 0,
          entryContractNum: 0,
          blowUpPrice: 0,
          gridNum: 0,
        };
      });
    }
    setCommonSetting({ fillAIParamsBtnActive: !fillAIParamsBtnActive });
  };
  return <ToggleAIParamsButton active={fillAIParamsBtnActive} onClick={toggle} />;
});

export default ToggleAutoFillButton;
