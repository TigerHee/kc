import React, {memo} from 'react';
import styled from '@emotion/native';

import infoIc from 'assets/common/ic-info.png';
import {RowWrap} from 'constants/styles';

const SecondaryText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
  margin-bottom: 8px;
`;

const Icon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;

const SecondaryFieldLabel = props => {
  const {title, tip, styles} = props;
  const {wrap = {}, text = {}} = styles || {};
  return (
    <RowWrap wrap={wrap}>
      <SecondaryText style={text}>{title}</SecondaryText>
      {tip && <Icon source={infoIc} />}
    </RowWrap>
  );
};

export default memo(SecondaryFieldLabel);
