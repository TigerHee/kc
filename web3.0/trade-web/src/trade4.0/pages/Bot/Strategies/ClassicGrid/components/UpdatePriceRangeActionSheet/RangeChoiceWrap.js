/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useCallback, useContext, useLayoutEffect } from 'react';
import { outOfRangeLangConfig, RangeChoice } from './RangeWidgets';
import ActionSheetController from './ActionSheetController';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';

const { rangeRadioConfig } = RangeChoice;
const RangeChoiceWrap = () => {
  const controllerRef = useContext(ActionSheetController);
  const { rangeState } = controllerRef.current;
  const { howRecommendTitle } = outOfRangeLangConfig[rangeState];
  const radioDataRef = useRef();
  useLayoutEffect(() => {
    controllerRef.current.onChoiceConfirm = () => {
      const ctrlCrt = controllerRef.current;
      ctrlCrt.choiceData = radioDataRef.current;
      ctrlCrt.rangeChoiceActionSheetRef.current.toggle();
      if (radioDataRef.current === rangeRadioConfig.EXTENDPRICE) {
        ctrlCrt.extendPriceActionSheetRef.current.toggle();
      } else if (radioDataRef.current === rangeRadioConfig.NORMALPRICE) {
        ctrlCrt.normalPriceActionSheetRef.current.toggle();
      }
    };
    return () => {
      controllerRef.current.choiceData = null;
      controllerRef.current.onChoiceConfirm = null;
    };
  }, []);
  const onRadioChange = useCallback((e) => {
    radioDataRef.current = e;
  }, []);
  return (
    <div>
      <Text as="div" color="text60" mb={12}>
        {_t(howRecommendTitle)}
      </Text>
      <RangeChoice rangeState={rangeState} onChange={onRadioChange} />
    </div>
  );
};

export default RangeChoiceWrap;
