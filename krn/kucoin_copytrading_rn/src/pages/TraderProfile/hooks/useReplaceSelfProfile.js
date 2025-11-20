import {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {RouterNameMap} from 'constants/router-name-map';
import {useParams} from 'hooks/useParams';
import {usePush} from 'hooks/usePush';

export const useReplaceSelfProfile = () => {
  const {configId: myLeadConfigId} = useSelector(
    state => state.leadInfo.activeLeadSubAccountInfo || {},
  );

  const {leadConfigId} = useParams();
  const {replace} = usePush();

  const handleReplaceSelfProfile = useCallback(() => {
    if (!leadConfigId || !myLeadConfigId) return;

    if (String(leadConfigId) === String(myLeadConfigId)) {
      replace(RouterNameMap.SelfTraderProfile, {
        leadConfigId,
      });
    }
  }, [leadConfigId, myLeadConfigId, replace]);

  useEffect(() => {
    handleReplaceSelfProfile();
  }, [handleReplaceSelfProfile]);
};
