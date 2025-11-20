import React, {memo} from 'react';

import {useIsMySelf} from '../hooks/useVisibilityHandler';
import {useIsShowFollowOrderFooter} from '../hooks/useVisibilityHandler/useIsShowFollowOrderFooter';
import FollowOrderFooter from './FollowOrderFooter';
import SelfSettingFooter from './SelfSettingFooter';

const ProfileFooter = ({summaryData}) => {
  const isShowFollowOrderFooter = useIsShowFollowOrderFooter();
  const isMySelf = useIsMySelf();

  if (isShowFollowOrderFooter) {
    return <FollowOrderFooter summaryData={summaryData} />;
  }

  if (isMySelf) {
    return <SelfSettingFooter summaryData={summaryData} />;
  }

  return null;
};

export default memo(ProfileFooter);
