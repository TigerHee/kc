/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import React, {memo} from 'react';
import {ORDER_STATUS_ENUM} from '../config';

const StatusWrapper = styled.View`
  background: ${({bgColor, theme}) => theme.colorV2[bgColor]};
  padding: 3px 6px;
  border-radius: 4px;
`;
const Label = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${({color, theme}) => theme.colorV2[color]};
`;

/**
 * Status
 */
const Status = memo(props => {
  const {status, ...restProps} = props;
  const {_t} = useLang();
  const {label, color, bgColor} = ORDER_STATUS_ENUM[status] || {};

  return (
    <StatusWrapper status={status} bgColor={bgColor} {...restProps}>
      <Label
        status={status}
        numberOfLines={1}
        ellipsizeMode={'tail'}
        color={color}>
        {_t(label)}
      </Label>
    </StatusWrapper>
  );
});

export default Status;
