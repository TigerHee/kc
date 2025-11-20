import React from 'react';
import {View} from 'react-native';

import {makeGroupArrayByFillNull} from 'utils/helper';
import {
  Container,
  Option,
  OptionLabel,
  OptionRowWrap,
  OptionWrap,
  SingleOptionWrap,
  Title,
} from './styles';

/**
 * Selector组件，用于选择选项。
 * @param {Object} props - 传递给组件的属性。
 * @param {string} props.title - Selector的标题。
 * @param {Array.<{value: string, label: string}>} props.options - Selector的选项。
 * @param {boolean} [props.multiple=false] - Selector是否支持多选。默认false单选
 * @param {string|string[]} props.value - Selector的当前值。如果multiple为false，则为字符串类型，如果multiple为true，则为数组类型。
 * @param {function} props.onChange - Selector的值改变时的回调函数。接受一个参数，即新的值。
 * @param {number} [props.columns=3] - Selector的选项每行显示的个数。 默认为3
 * @param {number} [props.gap=8] - Selector的选项间距。默认为8单位px
 */
const Selector = ({
  title,
  options,
  multiple = false,
  value,
  onChange,
  columns = 3,
  gap = 8,
}) => {
  const isSelected = option => {
    if (multiple) {
      // 如果支持多选，判断 value 数组中是否包含该选项的 value
      return value.includes(option.value);
    } else {
      return value === option.value;
    }
  };

  const handlePress = option => {
    if (multiple) {
      // 如果支持多选，判断 value 数组中是否包含该选项的 value
      if (value.includes(option.value)) {
        // 如果包含，说明要取消选择，那么从 value 数组中移除该选项的 value
        onChange(value.filter(v => v !== option.value));
      } else {
        // 如果不包含，说明要选择，那么向 value 数组中添加该选项的 value
        onChange([...value, option.value]);
      }
    } else {
      // 如果不支持多选，直接将该选项的 value 作为新的值
      onChange(option.value);
    }
  };

  const optionMultiGroups = makeGroupArrayByFillNull(options, columns);

  return (
    <Container>
      <Title>{title}</Title>
      <OptionWrap>
        {optionMultiGroups.map((optionGroup, index) => {
          const lastRow = optionMultiGroups?.length - 1 === index;

          return (
            <OptionRowWrap lastRow={lastRow} key={`group_${index}`}>
              {optionGroup?.map((option, optIdx) => {
                const isRowEnd = optIdx === optionGroup.length - 1;
                return (
                  <SingleOptionWrap
                    key={option?.value || optIdx}
                    gap={gap}
                    isRowEnd={isRowEnd}>
                    {option ? (
                      <Option
                        onPress={() => handlePress(option)}
                        key={option.value || index}
                        gap={gap}
                        index={index}
                        selected={isSelected(option)}>
                        <OptionLabel selected={isSelected(option)}>
                          {option.label}
                        </OptionLabel>
                      </Option>
                    ) : (
                      <View />
                    )}
                  </SingleOptionWrap>
                );
              })}
            </OptionRowWrap>
          );
        })}
      </OptionWrap>
    </Container>
  );
};

export default Selector;
