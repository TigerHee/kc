import React from 'react';
import {Pressable} from 'react-native';

import useLang from 'hooks/useLang';
import {makeShowPnlSwitchList} from '../constant';
import {StyledTab, StyledTabs, StyledText} from './styles';

const ProfitRateSwitch = ({value, onChange}) => {
  const {_t} = useLang();
  const switchList = makeShowPnlSwitchList({_t});

  return (
    <StyledTabs>
      {switchList.map((i, idx) => (
        <Pressable key={idx} onPress={() => onChange(i.value)}>
          <StyledTab isActive={value === i.value}>
            <StyledText isActive>{i.label}</StyledText>
          </StyledTab>
        </Pressable>
      ))}
    </StyledTabs>
  );
};

export default ProfitRateSwitch;
