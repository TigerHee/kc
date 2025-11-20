/**
 * Owner: tiger@kupotech.com
 */
import React, { useMemo } from 'react';
import styled from '@emotion/native';
import useTheme from 'hooks/useTheme';
import registerAPI from 'utils/registerAPI';
import API from './API';

const Wrapper = styled.View`
  width: 100%;
  flex-direction: ${({ listDirection }) => listDirection};
  flex-wrap: ${({ isRowDirection }) => (isRowDirection ? 'wrap' : 'nowrap')};
`;
const Item = styled.TouchableHighlight`
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  ${({ isRowDirection, theme, isActive, index, colNumber, layoutPercentConfig }) => {
    if (isRowDirection) {
      return `
        height: 32px;
        border-width: 1px;
        border-style: solid;
        border-radius: 16px;
        flex-shrink:0;
        justify-content: center;
        margin-left: ${index % colNumber === 0 ? 0 : `${layoutPercentConfig?.marginLeft}%`};
        flex-basis: ${(100 - layoutPercentConfig?.marginLeft * (colNumber - 1)) / colNumber}%;
        margin-top: ${index >= colNumber ? `${layoutPercentConfig?.marginTop}%` : 0};
        border-color: ${isActive ? theme.colorV2.text : theme.colorV2.divider8};
      `;
    }
    return `
      flex:1;
      height: 48px;
    `;
  }}
`;
const ItemText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  font-style: normal;
  color: ${({ theme, isActive, isRowDirection }) => {
    if (isRowDirection) {
      return isActive ? theme.colorV2.text : theme.colorV2.text60;
    }
    return isActive ? theme.colorV2.primary : theme.colorV2.text;
  }};
`;

const Select = ({
  value,
  onChange,
  options,
  multiple,
  listDirection,
  colNumber,
  layoutPercentConfig,
  styles,
  ...otherProps
}) => {
  const theme = useTheme();

  const isRowDirection = useMemo(() => listDirection === 'row', [listDirection]);

  const onHandlePress = (v, item) => {
    let newVal = null;

    if (multiple) {
      if (value.includes(v)) {
        newVal = value.filter((i) => i !== v);
      } else {
        newVal = [...value, v];
      }
    } else {
      newVal = v;
    }

    onChange(newVal, item);
  };

  return (
    <Wrapper
      listDirection={listDirection}
      isRowDirection={isRowDirection}
      style={styles.wrapper}
      {...otherProps}
    >
      {options.map((item, index) => {
        const { label, value: itemValue } = item;
        const isActive = multiple ? value?.includes(itemValue) : value === itemValue;

        return (
          <Item
            underlayColor={theme.colorV2.cover4}
            activeOpacity={1}
            onPress={() => onHandlePress(itemValue, item)}
            isActive={isActive}
            isRowDirection={isRowDirection}
            style={[styles.item, isActive ? styles.itemActive : null]}
            index={index}
            colNumber={colNumber}
            layoutPercentConfig={layoutPercentConfig}
            key={itemValue}
          >
            {typeof label === 'string' ? (
              <ItemText
                isActive={isActive}
                isRowDirection={isRowDirection}
                style={[styles.itemText, isActive ? styles.itemTextActive : null]}
              >
                {label}
              </ItemText>
            ) : (
              label
            )}
          </Item>
        );
      })}
    </Wrapper>
  );
};

registerAPI(Select, API);
export default Select;
