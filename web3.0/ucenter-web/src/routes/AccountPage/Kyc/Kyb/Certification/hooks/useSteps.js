/**
 * Owner: vijay.zhou@kupotech.com
 */
import useStep1 from './useStep1';
import useStep2 from './useStep2';
import useStep3 from './useStep3';
import useStep4 from './useStep4';
import useStep5 from './useStep5';

const useSteps = (props) => {
  const step1 = useStep1(props);
  const step2 = useStep2(props);
  const step3 = useStep3(props);
  const step4 = useStep4(props);
  const step5 = useStep5(props);

  return [step1, step2, step3, step4, step5];
};

export default useSteps;
