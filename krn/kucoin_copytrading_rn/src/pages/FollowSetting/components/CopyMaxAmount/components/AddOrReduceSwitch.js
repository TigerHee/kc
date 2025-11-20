import React, {useMemo} from 'react';

import useLang from 'hooks/useLang';
import {StyledTab, StyledTabs, StyledText} from './styles';

export const AmountDirectionType = {
  Add: 'Add',
  Reduce: 'Reduce',
};

const AddOrReduceSwitch = ({value, onChange}) => {
  const {_t} = useLang();

  const switchList = useMemo(() => {
    return [
      {
        label: _t('05c604c8f2384000a36b'),
        value: AmountDirectionType.Add,
      },
      {
        label: _t('bb1b91451fdd4000a689'),
        value: AmountDirectionType.Reduce,
      },
    ];
  }, [_t]);

  return (
    <StyledTabs>
      {switchList.map((i, idx) => (
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

export default AddOrReduceSwitch;
