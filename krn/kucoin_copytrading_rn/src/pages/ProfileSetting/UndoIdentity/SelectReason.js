import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Checkbox} from '@krn/ui';

import {safeArray} from 'utils/helper';
import {Label, MChooseItem, ReasonWrap} from './styles';

const ChooseItem = ({label, checked, onChecked}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onChecked(!checked)}>
      <MChooseItem active={checked}>
        <Label>{label}</Label>
        <Checkbox
          checked={checked}
          onChange={val => onChecked(val)}
          checkedType={1}
        />
      </MChooseItem>
    </TouchableOpacity>
  );
};

const SelectReason = props => {
  const {onChange, options} = props;

  const [checkMap, setCheckMap] = useState({});

  const onChecked = (checked, item) => {
    const updateMap = {
      ...(checkMap || {}),
      [item.id]: checked,
    };
    setCheckMap(updateMap);
    const value = Object.entries(updateMap)
      .filter(entry => !!entry[1])
      ?.map(entry => entry[0]);

    onChange?.(value);
  };
  return (
    <ReasonWrap>
      {safeArray(options).map(item => {
        return (
          <ChooseItem
            key={item.id}
            label={item.label}
            checked={checkMap[item.id]}
            onChecked={checked => onChecked(checked, item)}
          />
        );
      })}
    </ReasonWrap>
  );
};

export default SelectReason;
