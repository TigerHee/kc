import {useMemoizedFn} from 'ahooks';
import {useSelector} from 'react-redux';

import {RouterNameMap} from 'constants/router-name-map';
import {usePush} from 'hooks/usePush';

export const useGotoTransfer = () => {
  const {uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const {push} = usePush();

  const gotoTransfer = useMemoizedFn(() => {
    push(RouterNameMap.AccountTransfer, {subUID});
  });

  return gotoTransfer;
};
