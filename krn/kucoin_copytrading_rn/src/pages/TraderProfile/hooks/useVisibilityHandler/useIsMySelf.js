import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {useParams} from 'hooks/useParams';

export const useIsMySelf = () => {
  const {leadConfigId} = useParams();

  const {configId: myLeadConfigId} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  // 当前交易员详情是否为本人交易员
  const isMySelf = useMemo(
    () => String(myLeadConfigId) === String(leadConfigId),
    [leadConfigId, myLeadConfigId],
  );

  return isMySelf;
};
