import React, {useCallback, useMemo, useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native';

import selectDefaultIcon from 'assets/common/select-group-icon.png';
import SelectDrawer from 'components/Common/Select/components/SelectDrawer';
import {isStringOrNumber} from 'utils/helper';
import {
  SelectedIcon,
  SelectedText,
  SelectedView,
  SelectGroupView,
  SelectWrapper,
} from './styles';

const equalValue = (a, b) => {
  if (Array.isArray(a)) {
    return (
      a.length === b.length && a.every((value, index) => value === b[index])
    );
  }
  return a === b;
};

/**
 *SelectGroup
 * @param {*} param0
 * options: {label: 'High profit',value: 'High profit',}
 * @returns
 */
const Select = ({
  style,
  onChange,
  value,
  defaultValue,
  renderActiveLabel,
  options = [],
}) => {
  const [activeSelect, setActiveSelect] = useState(false);

  const toggleActiveSelect = useCallback(() => {
    setActiveSelect(!activeSelect);
  }, [activeSelect]);

  const handlePressOption = useCallback(
    (value, item) => {
      onChange && onChange(value, item);
      toggleActiveSelect();
    },
    [toggleActiveSelect, onChange],
  );

  const outerSelectText = useMemo(() => {
    const targetItem = options?.find(i =>
      equalValue(i.value, value || defaultValue),
    );
    if (renderActiveLabel && typeof renderActiveLabel === 'function') {
      return renderActiveLabel(targetItem);
    }
    if (targetItem?.label && isStringOrNumber(targetItem.label)) {
      return targetItem?.label;
    }
    return targetItem?.value;
  }, [defaultValue, options, renderActiveLabel, value]);

  return (
    <SelectGroupView style={style}>
      <SelectWrapper>
        <TouchableWithoutFeedback
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={toggleActiveSelect}>
          <SelectedView>
            {React.isValidElement(outerSelectText) ? (
              outerSelectText
            ) : (
              <SelectedText numberOfLines={1}>{outerSelectText}</SelectedText>
            )}
            <SelectedIcon source={selectDefaultIcon} />
          </SelectedView>
        </TouchableWithoutFeedback>
      </SelectWrapper>
      <SelectDrawer
        onClose={toggleActiveSelect}
        list={options || []}
        show={activeSelect}
        selectValue={value}
        handleClickItem={value => handlePressOption(value)}
      />
    </SelectGroupView>
  );
};

export default Select;
