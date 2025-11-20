/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 18:16:45
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 17:20:40
 */

import { memo } from 'react';
import { _t } from 'src/tools/i18n';
import closeIcon from 'static/slothub/onboard-close.svg';
import { useGenerateDescCardPositionStyle } from '../hooks/useGenerateDescCardPositionStyle';
import useOnboardingSteps from '../hooks/useOnboardingSteps';

import { useToggleOnboarding } from '../hooks';
import { useEnhanceOnboardLockBodyScroll } from '../hooks/useEnhanceOnboardLockBodyScroll';
import {
  AbsoluteH5Close,
  CloseImg,
  stepCloseBtnStyles,
  StepTipTitle,
  TourButtonArea,
  TourPopupCard,
  TourPopupWrap,
  triangleStyles,
} from '../styled';

const TourPopup = ({ steps }) => {
  const { step, nextStep, prevStep, finish, currentStep } = useOnboardingSteps(steps);
  const {
    content,
    rootStyle,
    descCardDirection,
    isVerticallyCentered,
    closeBtnStyle,
    descCardStyle,
  } = step || {};
  const toggle = useToggleOnboarding();
  useEnhanceOnboardLockBodyScroll(currentStep);
  const triangleStyle = triangleStyles?.[descCardDirection];
  const [cardRef, cardPositionStyle] = useGenerateDescCardPositionStyle({
    descCardDirection,
    isVerticallyCentered,
  });

  const isH5AbsoluteCloseBtnStyle = closeBtnStyle === stepCloseBtnStyles.h5AbsolutePosition;
  if (!step) return null;

  return (
    <>
      {isH5AbsoluteCloseBtnStyle && (
        <AbsoluteH5Close
          src={closeIcon}
          onClick={toggle}
          alt="close ico"
          data-inspector="gemslot_onboarding_Close_h5"
        />
      )}
      <TourPopupWrap className={rootStyle}>
        {!isH5AbsoluteCloseBtnStyle && (
          <CloseImg
            className={closeBtnStyle}
            src={closeIcon}
            onClick={toggle}
            alt="close ico"
            data-inspector="gemslot_onboarding_Close"
          />
        )}{' '}
        {content}
        <div style={cardPositionStyle} className={descCardStyle}>
          <TourPopupCard ref={cardRef} className={triangleStyle}>
            <StepTipTitle>{step.step?.()}</StepTipTitle>
            <span className="desc">{step.title?.()}</span>

            <TourButtonArea>
              {currentStep > 0 && (
                <button className="last" onClick={prevStep}>
                  {_t('dac1daeb4b014000a4ec')}
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button className="next" onClick={nextStep}>
                  {_t('284f0559d88c4000a9ff')}
                </button>
              ) : (
                <button className="next" onClick={finish}>
                  {_t('7746336d9be34000a008')}
                </button>
              )}
            </TourButtonArea>
          </TourPopupCard>
        </div>
      </TourPopupWrap>
    </>
  );
};

export default memo(TourPopup);
