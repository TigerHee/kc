import {SETTING_SCENE} from 'pages/FollowSetting/constant';
import {useCallback} from 'react';
import {showToast} from '@krn/bridge';

import {RouterNameMap} from 'constants/router-name-map';
import {usePush} from 'hooks/usePush';

export const useGotoFollowSetting = () => {
  const {push} = usePush();

  const gotoCreateFollowSetting = useCallback(
    leadConfigId => {
      if (!leadConfigId) {
        return showToast('data invalid');
      }
      push(RouterNameMap.FollowSetting, {
        scene: SETTING_SCENE.create,
        leadConfigId,
      });
    },
    [push],
  );

  const gotoViewFollowSetting = useCallback(
    ({leadConfigId, copyConfigId}) => {
      if (!leadConfigId) {
        return showToast('data invalid');
      }
      push(RouterNameMap.FollowSetting, {
        scene: SETTING_SCENE.readonly,
        leadConfigId,
        copyConfigId,
      });
    },
    [push],
  );

  return {gotoCreateFollowSetting, gotoViewFollowSetting};
};
