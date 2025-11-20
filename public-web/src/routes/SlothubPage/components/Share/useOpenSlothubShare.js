/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-12 14:55:06
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 14:02:03
 */
import { actions, bridge, helper } from '@kc/telegram-biz-sdk';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

const APP_SCENE_LAUNCH_SHARE_FREQUENCY = 600;

export const useOpenSlothubShare = () => {
  const dispatch = useDispatch();
  const referralCode = useSelector((state) => state.user.referralCode);

  const openShare = useMemoizedFn((scene, data) => {
    if (bridge.isTMA()) {
      actions.share({
        startapp: helper.getWebViewParam('/gemslot', {
          rcode: referralCode,
          utm_source: 'gemslot',
        }),
      });
    } else {
      dispatch({
        type: 'slothub/updateShareModalConfig',
        payload: {
          visible: true,
          scene,
          data,
        },
      });
    }
  });

  /**
   * 打开分享弹窗
   * @param {string} scene 分享场景
   * @param {object} data 分享数据
   */
  const { run: open } = useDebounceFn(openShare, {
    wait: APP_SCENE_LAUNCH_SHARE_FREQUENCY,
    leading: true,
    trailing: false,
  });

  return { open };
};
