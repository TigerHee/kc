import {useMemoizedFn} from 'ahooks';
import {useState} from 'react';

import useTracker from 'hooks/useTracker';

export const useEditMyProfile = () => {
  const [isShowEditMyProfile, setEditShow] = useState(false);
  const {onClickTrack} = useTracker();

  const handleEditMyProfile = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'button',
      locationId: 'edit',
    });
    setEditShow(true);
  });

  const closeSelfEdit = () => {
    setEditShow(false);
  };

  return {
    handleEditMyProfile,
    closeSelfEdit,
    isShowEditMyProfile,
  };
};
