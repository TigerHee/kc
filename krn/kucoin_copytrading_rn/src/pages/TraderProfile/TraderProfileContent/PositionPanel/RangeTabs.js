import React from 'react';
import {Tabs} from '@krn/ui';

import useLang from 'hooks/useLang';
import {makeRangeTabList} from '../constant';
import {StyledTabs, TabText} from './styles';

const {Tab} = Tabs;

const RangeTabs = props => {
  const {rangeValue, handleRangeChange} = props;
  const {_t} = useLang();
  const rangeTabList = makeRangeTabList(_t);
  return (
    <StyledTabs
      variant="border"
      value={rangeValue}
      onChange={handleRangeChange}>
      {rangeTabList.map((i, idx) => (
        <Tab
          key={i.labelKey || idx}
          label={<TabText active={rangeValue === i.itemKey}>{i.label}</TabText>}
          value={i.itemKey}
        />
      ))}
    </StyledTabs>
  );
};

export default RangeTabs;
