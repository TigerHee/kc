import React from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import prefixIc from 'assets/applyTrade/desc-text-prefix-ic.png';
import {ContextTextItemWrap, DescText, DescTextPrefixIcon} from './styles';

export const ContentList = ({contentList}) => {
  return (
    <View
      style={css`
        flex: 1;
        margin-right: 16px;
      `}>
      {contentList?.map((text, idx) => {
        const isLast = idx === contentList - 1;
        return (
          <ContextTextItemWrap key={idx} isLast={isLast}>
            <DescTextPrefixIcon source={prefixIc} autoRotateDisable />
            <DescText>{text}</DescText>
          </ContextTextItemWrap>
        );
      })}
    </View>
  );
};
