/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 18:22:39
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-20 21:39:21
 */
import { useMemoizedFn } from 'ahooks';
import { useDispatch } from 'react-redux';
import { IS_SHOW_ONBOARD_DIALOG_CACHE_KEY } from 'src/routes/SlothubPage/constant';
import storage from 'src/utils/storage';

export const useToggleOnboarding = () => {
  const dispatch = useDispatch();

  const onToggle = useMemoizedFn(() => {
    dispatch({ type: 'slothub/toggleOnboardingPopupVisible' });

    const isShowOnboardDialog = storage.getItem(IS_SHOW_ONBOARD_DIALOG_CACHE_KEY);
    !isShowOnboardDialog && storage.setItem(IS_SHOW_ONBOARD_DIALOG_CACHE_KEY, true);
  });
  return onToggle;
};
