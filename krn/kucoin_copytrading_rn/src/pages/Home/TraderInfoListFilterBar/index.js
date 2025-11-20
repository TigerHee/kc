import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';

import useTracker from 'hooks/useTracker';
import OuterSlideSelect from './components/OuterSlideSelect';
import {
  OutSelectValue2TrackIdMap,
  useMakeRankListSortOptions,
} from './constant';
import {FilterBarWrap} from './styles';

const TraderInfoListFilterBar = ({style, updateFormState, formState}) => {
  const rankOptions = useMakeRankListSortOptions();
  const {onClickTrack} = useTracker();

  const onChangeOuterSlideSelect = useMemoizedFn(value => {
    onClickTrack({
      blockId: 'market',
      locationId: OutSelectValue2TrackIdMap[value] || '',
    });
    updateFormState({
      sort: value,
    });
  });

  return (
    <FilterBarWrap style={style}>
      <OuterSlideSelect
        options={rankOptions}
        value={formState.sort}
        onChange={onChangeOuterSlideSelect}
      />
    </FilterBarWrap>
  );
};

export default memo(TraderInfoListFilterBar);
