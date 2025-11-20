/*
 * @Date: 2024-06-20 20:53:18
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-20 21:37:54
 */
/**
 * owner: larvide.peng@kupotech.com
 */
import { useMemoizedFn } from 'ahooks';
import activityRulesGuide from 'static/slothub/activity-rules-guide.svg';
import { _t } from 'tools/i18n';
import { useToggleOnboarding } from '../OnboardingPopup/hooks';
import { HighlightText } from './styled';

const ActivityRulesGuideTitle = ({ onCloseHandler }) => {
  const toggleOnboarding = useToggleOnboarding();

  const openOnboarding = useMemoizedFn(() => {
    onCloseHandler();
    toggleOnboarding();
  });

  return (
    <HighlightText variant="text" onClick={openOnboarding}>
      <img src={activityRulesGuide} alt="activity-rules-guide horizontal-flip-in-arabic" />
      {_t('1b1dfcdbb7db4000ace4')}
    </HighlightText>
  );
};
export default ActivityRulesGuideTitle;
