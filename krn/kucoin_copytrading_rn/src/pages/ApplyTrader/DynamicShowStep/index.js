import React, {memo} from 'react';

import {APPLY_TRADER_STEPS} from '../constants';
import useApplyStep from '../useApplyStep';
import ApplicationApproved from './ApplicationApproved';
import ApplicationDenied from './ApplicationDenied';
import Introduction from './Introduction';
import LiveAssessment from './LiveAssessment';
import PendingReview from './PendingReview';

const stepComponentMap = {
  [APPLY_TRADER_STEPS.UN_APPLY]: Introduction,
  [APPLY_TRADER_STEPS.PENDING_REVIEW]: PendingReview,
  [APPLY_TRADER_STEPS.LIVE_ASSESSMENT]: LiveAssessment,
  [APPLY_TRADER_STEPS.APPLICATION_DENIED]: ApplicationDenied,
  [APPLY_TRADER_STEPS.APPLICATION_APPROVED]: ApplicationApproved,
};

const DynamicStepComponent = () => {
  const [state, setStep] = useApplyStep();

  const StepComponent = stepComponentMap[state.currentStep];

  if (!StepComponent) return null;

  return <StepComponent setStep={setStep} />;
};

export default memo(DynamicStepComponent);
