import React, {memo} from 'react';
import {Image} from 'react-native';
import styled, {css} from '@emotion/native';

import {getEnhanceColorByType} from 'utils/color-helper';
import {convertPxToReal} from 'utils/computedPx';

const Wrap = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({theme}) =>
    getEnhanceColorByType(theme.type, 'quickGuideContentImgBg')};
`;

export const ContentImage = memo(
  ({style, width, height, source, hiddenPaddingColor = false}) => {
    if (hiddenPaddingColor) {
      return (
        <Image
          style={[
            css`
              border-radius: 12px;
              // 处理 rtl场景图片错误上下反转问题
              transform: scaleX(1);
              width: ${convertPxToReal(width)};
              height: ${convertPxToReal(height)};
            `,
            style,
          ]}
          source={source}
        />
      );
    }

    return (
      <Wrap
        style={[
          style,
          css`
            width: ${convertPxToReal(width)};
            height: ${convertPxToReal(height)};
          `,
        ]}>
        <Image
          style={[
            css`
              // 处理 rtl场景图片错误上下反转问题
              transform: scaleX(1);
              width: ${convertPxToReal(width - 32)};
              height: ${convertPxToReal(height - 32)};
            `,
          ]}
          source={source}
        />
      </Wrap>
    );
  },
);
