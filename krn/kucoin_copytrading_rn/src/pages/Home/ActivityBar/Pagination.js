import React, {memo} from 'react';
import {View} from 'react-native';
import {Pagination as InnerPagination} from 'react-native-snap-carousel';
import styled, {css} from '@emotion/native';

import {convertPxToReal} from 'utils/computedPx';

const ActiveDotElement = styled.View`
  width: 8px;
  height: 3px;
  border-radius: 3px;
  background-color: ${({theme}) => theme.colorV2.cover40};
  margin-right: 3px;
`;

const DotElement = styled.View`
  width: 3px;
  height: 3px;
  border-radius: 3px;
  background-color: ${({theme}) => theme.colorV2.cover12};
  margin-right: 3px;
`;

const AbsolutePaginationWrapCss = css`
  position: absolute;
  padding: 0;
  bottom: ${convertPxToReal(16)};
  left: ${convertPxToReal(62)};
`;

const Pagination = ({bannerList, activeItem}) => {
  if (bannerList?.length === 1) {
    return (
      <View style={AbsolutePaginationWrapCss}>
        <ActiveDotElement />
      </View>
    );
  }

  return (
    <InnerPagination
      dotsLength={bannerList?.length}
      containerStyle={AbsolutePaginationWrapCss}
      activeDotIndex={activeItem}
      inactiveDotElement={<DotElement />}
      dotElement={<ActiveDotElement />}
    />
  );
};

export default memo(Pagination);
