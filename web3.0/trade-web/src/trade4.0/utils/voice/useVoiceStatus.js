/*
 * @owner: borden@kupotech.com
 * @desc: 获取单个音频的开关状态
 */
import { useSelector } from 'dva';
import { getStateFromStore } from '@/utils/stateGetter';
import { VOICE } from './config';

export default function useVoiceStatus(code) {
  const soundReminderSettings = useSelector(
    (state) => state.setting.soundReminderSettings,
  );
  return Boolean(soundReminderSettings[VOICE[code]?.category]);
}

export const getVoiceStatusByCode = (code, settings) => {
  const soundReminderSettings = settings || getStateFromStore(
    (state) => state.setting.soundReminderSettings,
  );
  return Boolean(soundReminderSettings[VOICE[code]?.category]);
};
