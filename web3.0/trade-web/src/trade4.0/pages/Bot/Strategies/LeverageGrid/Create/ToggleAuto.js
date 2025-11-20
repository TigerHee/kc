/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useCallback } from 'react';
import { useModel } from './model';
import { _t } from 'Bot/utils/lang';
import { numberFixed } from 'Bot/helper';
import { useDispatch } from 'dva';
import ToggleAIParamsButton from 'Bot/components/Common/ToggleAIParamsButton';

const ToggleAutoFillButton = React.memo(({ symbolInfo, setRelatedParams, form }) => {
  const {
    commonSetting: { direction, fillAIParamsBtnActive },
    setCommonSetting,
  } = useModel();
  const { symbolCode, pricePrecision } = symbolInfo;
  const lockRef = useRef(false);
  const dispatch = useDispatch();
  const toGetAIParams = useCallback(() => {
    lockRef.current = true;
    dispatch({
      type: 'leveragegrid/getAIParams',
      payload: {
        symbol: symbolCode,
        direction,
      },
    })
      .then((data) => {
        const { down, up, gridNum, leverage } = data;
        // 设置倍数
        setCommonSetting({ leverage });
        setRelatedParams(data);
        // 设置其他表单
        form.setFieldsValue({
          down: numberFixed(down, pricePrecision),
          up: numberFixed(up, pricePrecision),
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
          lastTradedPrice: 0,
          leverage: 2,
          gridProfitRatio: 0,
          up: 0,
          down: 0,
          gridNum: 0,
          maxGridNum: 0,
          diff: 0,
          gridProfitUpperRatio: 0,
          gridProfitLowerRatio: 0,
          minInvestment: 0,
          maxInvestment: 0,
          borrowAmount: 0,
          dailyRate: 0,
          blowUpPrice: 0,
        };
      });
    }
    setCommonSetting({ fillAIParamsBtnActive: !fillAIParamsBtnActive });
  };
  return <ToggleAIParamsButton active={fillAIParamsBtnActive} onClick={toggle} />;
});

export default ToggleAutoFillButton;
