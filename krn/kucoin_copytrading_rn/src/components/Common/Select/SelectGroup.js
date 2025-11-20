import React from 'react';
import styled from '@emotion/native';

// import select_active from 'assets/common/select_active.png';
import selectDefaultIcon from 'assets/common/select-group-icon.png';
import SelectDrawer from './components/SelectDrawer';

const SelectGroupView = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colorV2.divider8};
`;

const SelectWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 35px;
  background-color: ${({theme}) => theme.colorV2.overlay};
`;

const SelectedView = styled.Pressable`
  flex-direction: row;
  align-items: center;
  margin-left: 16px;
`;
const SelectedText = styled.Text`
  font-size: 12px;
  line-height:  15.6px
  /* color: ${({theme, active}) =>
    active ? theme.colorV2.primary : theme.colorV2.text}; */
  margin-right: 4px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 400;
`;

const SelectedIcon = styled.Image`
  width: 12px;
  height: 12px;
`;

const SelectGroup = ({
  style,
  activeIndex,
  setActiveIndex,
  onChange,
  selectGroupOptions = [],
}) => {
  const handlePressOption = (index, value, item) => {
    onChange && onChange(index, value, item);
    setActiveIndex(-1);
  };
  if (!selectGroupOptions?.length) return null;
  return (
    <SelectGroupView style={style}>
      <SelectWrapper>
        {selectGroupOptions.map((item, index) => (
          <SelectedView
            key={item.key}
            onPress={() => setActiveIndex(activeIndex === index ? -1 : index)}>
            <SelectedText active={index === activeIndex}>
              {item.options?.find(i => i.value === item.value)?.label}
            </SelectedText>

            <SelectedIcon
              source={selectDefaultIcon}
              // source={index === activeIndex ? select_active : select_default}
            />
          </SelectedView>
        ))}
      </SelectWrapper>
      <SelectDrawer
        onClose={() => setActiveIndex(-1)}
        list={selectGroupOptions?.[activeIndex]?.options || []}
        show={!!selectGroupOptions?.[activeIndex]?.options?.length}
        selectValue={selectGroupOptions?.[activeIndex]?.value}
        handleClickItem={(value, item) =>
          handlePressOption(activeIndex, value, item)
        }
      />
    </SelectGroupView>
  );
};

export default SelectGroup;
