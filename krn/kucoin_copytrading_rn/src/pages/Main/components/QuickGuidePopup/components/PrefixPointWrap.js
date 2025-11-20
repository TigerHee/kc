import React, {memo} from 'react';
import styled, {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {BaseText} from '../styles';

const LineWrap = styled.View`
  flex-direction: row;
`;

export const PrefixPointWrap = memo(
  ({children, style, pointStyle, isBlack}) => {
    const {colorV2} = useTheme();
    const colorStyle = css`
      color: ${isBlack ? colorV2.text : colorV2.text60};
    `;
    return (
      <LineWrap style={style}>
        <BaseText style={[colorStyle, pointStyle]}>・</BaseText>
        {children}
      </LineWrap>
    );
  },
);
