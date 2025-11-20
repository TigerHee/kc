/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-05-29 18:21:16
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:34:01
 */
import { ButtonWrap, TaskButton, TimesPoint } from './index.style';

import { useMemoizedFn } from 'ahooks';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import { DEFAULT_SUBMIT_BTN_TEXT_KEY_CONFIG, SUBMIT_BTN_STYLE_TYPE_MAP } from './constant';
import { useHandleTaskBtn } from './useHandleTaskBtn';

const TaskSubmitButton = (props) => {
  const {
    children,
    canReceiveTimes = 0,
    overrideTextConfig = {},
    isFinish = false,
    toLink,
    taskId,
    onPreClick,
    ...others
  } = props;

  const { isH5 } = useDeviceHelper();
  const textConfig = {
    ...DEFAULT_SUBMIT_BTN_TEXT_KEY_CONFIG,
    ...overrideTextConfig,
  };

  const { handleClick, btnText, btnStyleType, loading } = useHandleTaskBtn(
    { toLink, isFinish, canReceiveTimes, children, taskId },
    textConfig,
  );

  const mergeHandleClick = useMemoizedFn(() => {
    onPreClick?.();
    handleClick();
  });

  const canReceive = btnStyleType === SUBMIT_BTN_STYLE_TYPE_MAP.canReceive;

  const enhanceProps = {
    loading: false,
    ...others,
    size: isH5 ? 'mini' : 'large',
    disabled: others?.disabled || btnStyleType === SUBMIT_BTN_STYLE_TYPE_MAP.disabled,
    isGreen: canReceive,
  };

  return (
    <ButtonWrap>
      <TaskButton onClick={mergeHandleClick} loading={loading} {...enhanceProps}>
        {!loading && !enhanceProps.loading ? btnText : ''}
      </TaskButton>
      {!!canReceiveTimes && canReceive && <TimesPoint>x{canReceiveTimes}</TimesPoint>}
    </ButtonWrap>
  );
};

export default TaskSubmitButton;
