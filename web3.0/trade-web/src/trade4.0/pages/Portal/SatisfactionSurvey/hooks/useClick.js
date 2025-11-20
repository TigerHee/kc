/**
 * Owner: harry.lai@kupotech.com
 */
import { useState, useCallback } from 'react';
import { commonSensorsFunc } from 'src/trade4.0/meta/sensors';
import { OTHER_OPTION_VALUE } from '../constant';
import { convertFormValues2TrackPayload, serializeValue, SurveyShowController } from '../util';

export const useClick = ({ closeSurvey, toggleFinishDialog }) => {
  const [values, setValues] = useState({
    score: 0,
    selectedOptions: [],
    otherContent: '',
  });

  const updateFormValue = useCallback(
    (key, value) => {
      setValues({
        ...values,
        [key]: value,
      });
    },
    [setValues, values],
  );

  const handleScore = useCallback((value) => updateFormValue('score', value), [updateFormValue]);

  const handleInputOther = useCallback(
    (value) => updateFormValue('otherContent', value),
    [updateFormValue],
  );

  const handleSelectedOptions = useCallback(
    (value) => updateFormValue('selectedOptions', value),
    [updateFormValue],
  );

  const handleSubmit = useCallback(() => {
    toggleFinishDialog();
    commonSensorsFunc(['satisfactionSurvey', 'click'], convertFormValues2TrackPayload(values));
    SurveyShowController.setIsSubmit();

    closeSurvey();
  }, [values, closeSurvey]);

  /** 不继续填写提交 调研, 直接关闭调研弹窗事件  */
  const handleDirectlyCloseSurvey = () => {
    SurveyShowController.addOneDirectlyCloseCounter();
    commonSensorsFunc(
      ['satisfactionSurvey', 'directlyCloseClick'],
      SurveyShowController.getDirectlyCloseCounter(),
    );

    closeSurvey();
  };

  return {
    values,
    handleSelectedOptions,
    handleScore,
    handleInputOther,
    handleSubmit,
    handleDirectlyCloseSurvey,
  };
};
