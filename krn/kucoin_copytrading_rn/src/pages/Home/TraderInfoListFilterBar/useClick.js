import {useCallback} from 'react';

import {RouterNameMap} from 'constants/';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';

export const useClick = () => {
  const {push} = usePush();
  const {onClickTrack} = useTracker();
  const handleGotoSearch = useCallback(() => {
    onClickTrack({
      blockId: 'market',
      locationId: 'searchButton',
    });

    push(RouterNameMap.TraderSearch);
  }, [onClickTrack, push]);

  return {handleGotoSearch};
};
