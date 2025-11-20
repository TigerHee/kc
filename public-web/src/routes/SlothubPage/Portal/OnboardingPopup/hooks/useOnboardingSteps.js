/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 18:16:17
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-20 17:32:30
 */
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { useToggleOnboarding } from '../hooks/';

export default function useOnboardingSteps(steps) {
  const [currentStep, setCurrentStep] = useState(0);
  const toggle = useToggleOnboarding();
  const nextStep = useMemoizedFn(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  });

  const prevStep = useMemoizedFn(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  });

  const finish = useMemoizedFn(() => {
    toggle();
    setCurrentStep(0);
  });

  return { currentStep, step: steps[currentStep], nextStep, prevStep, finish };
}
