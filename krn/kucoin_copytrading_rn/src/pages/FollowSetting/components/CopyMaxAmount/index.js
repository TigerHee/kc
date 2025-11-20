import {getIsCancelOrCloseByStatus} from 'pages/FollowSetting/presenter/helper';
import React, {memo} from 'react';

import {CreateSceneCopyAmountInput} from './components/CreateSceneCopyAmountInput';
import {EditModeCopyMaxAmount} from './EditModeCopyMaxAmount';

export const FOLLOW_SETTING_EDIT_MODE = {
  Create: 'Create',
  Edit: 'Edit',
};

export const CopyMaxAmount = memo(props => {
  const {editMode = FOLLOW_SETTING_EDIT_MODE.Create, status} = props;

  const isCancelOrClose = getIsCancelOrCloseByStatus(status);

  if (editMode === FOLLOW_SETTING_EDIT_MODE.Create || isCancelOrClose) {
    return <CreateSceneCopyAmountInput editMode={editMode} />;
  }

  if (editMode === FOLLOW_SETTING_EDIT_MODE.Edit) {
    return <EditModeCopyMaxAmount />;
  }

  return null;
});
