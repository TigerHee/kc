import React, {memo} from 'react';
import {ScrollView, TouchableOpacity, useWindowDimensions} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import icRight from 'assets/common/ic-green-right.png';
import {convertPxToReal} from 'utils/computedPx';
import {ConfirmPopup} from '../../Confirm';
import {CheckIcon, Content, ContentWrapper, Item} from './styles';

const RenderItem = ({item, index, handleClickItem, selectValue, length}) => {
  const {value, label = null} = item || {};
  const labelIsText = ['string', 'number'].includes(typeof label);
  const isSelected = selectValue === value;

  return (
    <TouchableOpacity onPress={() => handleClickItem(value, item)}>
      <Item selected={isSelected} key={labelIsText ? label : index}>
        <ContentWrapper>
          {labelIsText ? (
            <Content last={index === length - 1}>{label}</Content>
          ) : (
            React.cloneElement(label, {
              onPress: () => handleClickItem(value, item),
            })
          )}
        </ContentWrapper>

        {isSelected && <CheckIcon source={icRight} />}
      </Item>
    </TouchableOpacity>
  );
};

const SelectDrawer = ({
  show,
  onClose,
  list,
  handleClickItem,
  selectValue,
  styles = {},

  ...rest
}) => {
  const screenHeight = Math.round(useWindowDimensions().height);
  const {colorV2} = useTheme();
  return (
    <ConfirmPopup
      styles={{
        ...styles,
        containerStyle: css`
          margin-top: 0;
          padding: 0;
          margin-left: 0;
          margin-right: 0;
        `,
      }}
      id="tag"
      show={show}
      onClose={onClose}
      onCancel={onClose}
      hiddenOk
      {...rest}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          maxHeight: Math.floor(0.66 * screenHeight) - 48,
          paddingTop: convertPxToReal(8, false),
        }}>
        {list.map((item, index) => {
          return (
            <RenderItem
              item={item}
              index={index}
              key={item.value || index}
              handleClickItem={handleClickItem}
              selectValue={selectValue}
              length={list.length}
            />
          );
        })}
      </ScrollView>
    </ConfirmPopup>
  );
};

export default memo(SelectDrawer);
