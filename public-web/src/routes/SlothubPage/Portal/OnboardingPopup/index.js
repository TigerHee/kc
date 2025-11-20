/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-11 17:33:10
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 16:27:29
 */
import { useMemo } from 'react';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import useLockBodyScroll from 'src/hooks/useLockBodyScroll';
import useRealInteraction from 'src/hooks/useRealInteraction';
import { useSelector } from 'src/hooks/useSelector';
import TourPopup from './components/TourPopup';
import { mateStepConfigList } from './constant';
import { BlurMask, LayoutWrap } from './styled';

/**
 * OnboardingPopup 新人引导弹窗
 */
const OnboardingPopup = () => {
  const visible = useSelector((state) => state.slothub.onboardingPopupVisible);
  const { isPC, isPad, isH5 } = useDeviceHelper();
  const realInteraction = useRealInteraction();
  const stepList = useMemo(() => mateStepConfigList({ isPC, isPad, isH5 }), [isPC, isPad, isH5]);
  useLockBodyScroll(visible);
  if (!visible || !realInteraction.pass) return null;

  return (
    <BlurMask>
      <LayoutWrap>
        <TourPopup steps={stepList} />
      </LayoutWrap>
    </BlurMask>
  );
};

export default OnboardingPopup;
