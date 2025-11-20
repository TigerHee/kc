/*
 * @Date: 2024-06-24 18:05:07
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:47:46
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import { useMemoizedFn } from 'ahooks';
import { SENSORS } from 'routes/SlothubPage/constant';
import { SlotHubShareScene } from '../Share/constant';
import { useOpenSlothubShare } from '../Share/useOpenSlothubShare';

export default function useActivityShare() {
  const { open } = useOpenSlothubShare();

  const openShareModal = useMemoizedFn(() => {
    open(SlotHubShareScene.airdropTip);
    SENSORS.share();
  });

  return {
    onClick: openShareModal,
  };
}
