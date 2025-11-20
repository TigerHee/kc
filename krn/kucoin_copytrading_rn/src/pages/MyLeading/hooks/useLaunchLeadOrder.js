import {useSelector} from 'react-redux';

import {gotoLeadTrade} from 'utils/native-router-helper';

export const useLaunchLeadOrder = () => {
  const {uid} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const launchLeadOrder = () => {
    gotoLeadTrade(uid);
  };

  return {launchLeadOrder};
};
