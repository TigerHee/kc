import {useState} from 'react';

import {FOLLOW_MODE_ENUM} from '../constant';

export const useSettingSceneAndTabHelper = () => {
  const [tabValue, setTabValue] = useState(FOLLOW_MODE_ENUM.fixedRate);

  const setTabIndex = idx => {
    setTabValue(
      idx === 0 ? FOLLOW_MODE_ENUM.fixedRate : FOLLOW_MODE_ENUM.fixedAmount,
    );
  };

  return {
    setTabIndex,
    tabValue,
    setTabValue,
  };
};
