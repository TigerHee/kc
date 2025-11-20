import React, {memo} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from '@emotion/native';
import {openNative} from '@krn/bridge';

import {useIsLight} from 'hooks/useIsLight';
import useTracker from 'hooks/useTracker';
import {convertPxToReal} from 'utils/computedPx';
import {CarouselWidth} from './styles';

const ImgContentWrap = styled.Image`
  width: ${CarouselWidth};
  height: ${convertPxToReal(85)};
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
`;

export const CommonCmsConfigBanner = memo(({config, index}) => {
  const {url, imageUrl, daytime_image_url: lightImageUrl, title} = config || {};
  const {onClickTrack} = useTracker();
  const isLight = useIsLight();

  const showImgUrl = isLight ? lightImageUrl : imageUrl;

  const gotoUrl = () => {
    onClickTrack({
      blockId: 'banner',
      locationId: 'cms',
      properties: {
        index,
        title,
      },
    });

    if (!url) return;
    openNative(url);
  };

  if (!showImgUrl) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={gotoUrl}>
      <ImgContentWrap source={{uri: showImgUrl}} />
    </TouchableWithoutFeedback>
  );
});
