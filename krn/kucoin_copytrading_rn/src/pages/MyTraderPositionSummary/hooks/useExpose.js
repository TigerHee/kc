import {useEffect} from 'react';

import useTracker from 'hooks/useTracker';

export const useExpose = ({rangeValue}) => {
  const {onClickTrack} = useTracker();

  useEffect(() => {
    onClickTrack({
      blockId: 'tab',
      locationId: rangeValue,
    });
  }, [rangeValue]);
};
