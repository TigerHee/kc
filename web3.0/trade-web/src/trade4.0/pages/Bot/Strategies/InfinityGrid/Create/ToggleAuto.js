/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useCallback } from 'react';
import { useModel } from './model';
import { _t } from 'Bot/utils/lang';
import { numberFixed } from 'Bot/helper';
import ToggleAIParamsButton from 'Bot/components/Common/ToggleAIParamsButton';
import Decimal from 'decimal.js';

const ToggleAutoFillButton = React.memo(({ form, aiInfo, setToggle, active }) => {
  // 两种不同的场景
  let fillAIParamsBtnActive;
  let setCommonSetting;
  if (setToggle) {
    setCommonSetting = setToggle;
    fillAIParamsBtnActive = active;
  } else {
    const meta = useModel();
    setCommonSetting = meta.setCommonSetting;
    fillAIParamsBtnActive = meta.commonSetting.fillAIParamsBtnActive;
  }

  const toggle = () => {
    if (!fillAIParamsBtnActive) {
      // 填充
      form.setFieldsValue({
        down: numberFixed(aiInfo.down),
        gridProfitRatio: Decimal(aiInfo.gridProfitRatio).times(100).toFixed(2, Decimal.ROUND_DOWN),
      });
      setToggle && form.validateFields();
    } else {
      // 清空
      form.resetFields();
    }
    setCommonSetting({ fillAIParamsBtnActive: !fillAIParamsBtnActive });
  };
  return <ToggleAIParamsButton active={fillAIParamsBtnActive} onClick={toggle} />;
});

export default ToggleAutoFillButton;
