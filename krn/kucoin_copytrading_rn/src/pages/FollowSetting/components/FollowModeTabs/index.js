import React, {memo} from 'react';

import useLang from 'hooks/useLang';
import {makeModeTabList} from '../../constant';
import {StyledTab, StyledTabs} from './styles';

const FollowModeTabs = props => {
  const {tabValue, setTabValue, style} = props;
  const {_t} = useLang();
  const modeTabList = makeModeTabList(_t);

  return (
    <StyledTabs style={style} value={tabValue} onChange={setTabValue}>
      {modeTabList.map((i, idx) => (
        <StyledTab
          isFirstElement={idx === 0}
          label={i.label}
          value={i.itemKey}
        />
      ))}
    </StyledTabs>
  );
};

export default memo(FollowModeTabs);
