import React, {memo} from 'react';
import styled from '@emotion/native';

import {useCalcPopupHeightHelper} from '../hooks/useCalcPopupHeightHelper';

export const PanelWrap = styled.ScrollView`
  background: ${({theme}) => theme.colorV2.layer};
  padding: 0 16px;
  max-height: ${({maxHeight}) => {
    if (!maxHeight) return 'unset';

    return `${maxHeight}px`;
  }};
`;

const FillBottomBlock = styled.View`
  height: 100px;
  width: 100%;
  flex: 1;
`;

export const Panel = memo(({children}) => {
  const {panelScreenHeight} = useCalcPopupHeightHelper();
  return (
    <PanelWrap maxHeight={panelScreenHeight}>
      {children}
      <FillBottomBlock />
    </PanelWrap>
  );
});
