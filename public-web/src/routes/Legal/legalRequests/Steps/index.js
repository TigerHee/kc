/**
 * Owner: odan.ou@kupotech.com
 */
import StepOne from './StepOne';
import StepThree from './StepThree';
import StepTwo from './StepTwo';

const CheckIndex = (props) => {
  const { currentStep, onVerifyRefresh, verifyData, ...others } = props;
  return (
    <div>
      {currentStep === 0 && <StepOne {...others} />}
      {currentStep === 1 && (
        <StepTwo onVerifyRefresh={onVerifyRefresh} verifyData={verifyData} {...others} />
      )}
      {currentStep === 2 && <StepThree {...others} />}
    </div>
  );
};

export default CheckIndex;
