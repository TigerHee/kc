import React, {memo} from 'react';
import styled, {css} from '@emotion/native';

import CommonCollapse from 'components/Common/Collapse';

const StyledWrap = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-color: ${({theme}) => theme.colorV2.cover8};
`;

export const Collapse = memo(({style, children, label}) => {
  return (
    <StyledWrap style={style}>
      <CommonCollapse
        styles={{
          label: css`
            font-size: 15px;
            font-weight: 600;
            line-height: 22.5px;
          `,
          itemWrap: css`
            margin-bottom: 8px;
            /* margin-top: 1; */
          `,
        }}
        label={label}>
        {children}
      </CommonCollapse>
    </StyledWrap>
  );
});
