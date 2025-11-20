import React, {memo} from 'react';

import {TrackMarkPoint, TrackMarkWrap} from './styles';

const TrackMark = ({isCovered}) => {
  return (
    <TrackMarkWrap isCovered={isCovered}>
      <TrackMarkPoint isCovered={isCovered} />
    </TrackMarkWrap>
  );
};

export default memo(TrackMark);
