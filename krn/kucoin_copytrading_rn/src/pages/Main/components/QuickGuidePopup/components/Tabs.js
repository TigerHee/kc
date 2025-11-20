import React from 'react';

import {StyledTab, StyledTabs, StyledText} from './styles';

const Tabs = ({value, onChange, options, style}) => {
  return (
    <StyledTabs style={style}>
      {options?.map((i, idx) => (
        <StyledTab
          isActive={value === i.value}
          key={idx}
          onPress={() => onChange(i.value)}>
          <StyledText isActive>{i.label}</StyledText>
        </StyledTab>
      ))}
    </StyledTabs>
  );
};

export default Tabs;
