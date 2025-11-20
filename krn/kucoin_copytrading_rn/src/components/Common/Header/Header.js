import React, {memo, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';

import {mediumHitSlop} from 'constants/index';
import useGoBack from 'hooks/useGoBack';
import {HeaderLeftArrow} from '../SvgIcon';
import {
  Center,
  HeaderWrapper,
  InnerHeaderBar,
  Left,
  Right,
  Title,
} from './styles';

const EnhanceHeader = props => {
  const {
    title = '',
    onPressBack,
    leftSlot,
    rightSlot,
    style,
    contentStyle,
  } = props;

  const goBack = useGoBack();

  const handleNavigateBack = useCallback(() => {
    if (onPressBack) return onPressBack();
    goBack();
  }, [goBack, onPressBack]);

  return (
    <>
      <HeaderWrapper style={style}>
        <InnerHeaderBar style={contentStyle}>
          <Left>
            {leftSlot === undefined ? (
              <TouchableOpacity
                hitSlop={mediumHitSlop}
                activeOpacity={0.8}
                onPress={handleNavigateBack}>
                <HeaderLeftArrow />
              </TouchableOpacity>
            ) : (
              leftSlot
            )}
          </Left>
          <Center>
            {!React.isValidElement(title) ? (
              <Title numberOfLines={1}>{title}</Title>
            ) : (
              title
            )}
          </Center>
          <Right>{rightSlot}</Right>
        </InnerHeaderBar>
      </HeaderWrapper>
    </>
  );
};

export default memo(EnhanceHeader);
