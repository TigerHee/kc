import React, {memo, useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';

import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import {TabItemBox, TabItemText} from './styles';

/**
 *SelectGroup
 * @param {*} param0
 * options: {label: 'High profit',value: 'High profit',}
 * @returns
 */
const OuterSlideSelect = ({onChange, value, options = []}) => {
  const handlePressOption = useCallback(
    (value, item) => {
      onChange && onChange(value, item);
    },
    [onChange],
  );

  return (
    <HorizontalScrollContainer bounces={false}>
      {options.map(i => (
        <TouchableWithoutFeedback
          key={i.value}
          onPress={() => handlePressOption(i.value)}>
          <TabItemBox isActive={value === i.value}>
            <TabItemText isActive={value === i.value}>{i.label}</TabItemText>
          </TabItemBox>
        </TouchableWithoutFeedback>
      ))}
    </HorizontalScrollContainer>
  );
};

export default memo(OuterSlideSelect);
