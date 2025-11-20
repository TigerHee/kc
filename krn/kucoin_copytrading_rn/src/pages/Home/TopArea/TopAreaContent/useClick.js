import {useMemoizedFn} from 'ahooks';
import {useLaunchLeadOrder} from 'pages/MyLeading/hooks/useLaunchLeadOrder';

import useTracker from 'hooks/useTracker';
import {gotoMyCopies, gotoMyLead} from './helper';

export const useClick = () => {
  const {launchLeadOrder} = useLaunchLeadOrder();
  const {onClickTrack} = useTracker();

  const launchLeadOrderWithTrack = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'head',
      locationId: 'leadTradeButton',
    });
    launchLeadOrder();
  });

  const gotoMyLeadWithTrack = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'head',
      locationId: 'myLead',
    });
    gotoMyLead();
  });

  const gotoMyCopiesWithTrack = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'head',
      locationId: 'myLead',
    });
    gotoMyCopies();
  });

  return {
    gotoMyCopiesWithTrack,
    gotoMyLeadWithTrack,
    launchLeadOrderWithTrack,
  };
};
