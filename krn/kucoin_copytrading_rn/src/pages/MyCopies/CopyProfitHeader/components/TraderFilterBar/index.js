import {MY_COPY_LIST_TYPE, RANGE_LIST_TYPE} from 'pages/MyCopies/constant';
import {useFilterHelper} from 'pages/MyCopies/hooks/useFilterHelper';
import React, {memo} from 'react';
import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';
import useTracker from 'hooks/useTracker';
import DatePicker from './DatePicker';
import LeadTraderPicker from './LeadTraderPicker';

const StyledLeadTraderPicker = styled(LeadTraderPicker)`
  margin-left: 12px;
`;

export const TraderFilterBar = memo(({tabValue, rangeValue}) => {
  const {filterValues, setFilterValues} = useFilterHelper();
  const {onClickTrackInMainMyCopyPage} = useTracker();
  if (tabValue !== MY_COPY_LIST_TYPE.myPosition) {
    return null;
  }
  const track = locationId => {
    onClickTrackInMainMyCopyPage({
      blockId: 'myPosition',
      locationId,
    });
  };

  return (
    <RowWrap>
      {rangeValue === RANGE_LIST_TYPE.history && (
        <DatePicker
          value={filterValues.startDate}
          onChange={value => {
            setFilterValues({startDate: value});
            track('timeButton');
          }}
        />
      )}
      <StyledLeadTraderPicker
        rangeValue={rangeValue}
        value={filterValues.traderLeadConfigId}
        onChange={value => {
          setFilterValues({traderLeadConfigId: value});
          track('fliterButton');
        }}
      />
    </RowWrap>
  );
});
