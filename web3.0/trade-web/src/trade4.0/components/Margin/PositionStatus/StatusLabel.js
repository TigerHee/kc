/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import { noop } from 'lodash';
import styled from '@emotion/styled';
import Tooltip from '@mui/Tooltip';
import { _t, _tHTML } from 'src/utils/lang';
import useMarginStatusConfig from '@/hooks/useMarginStatusConfig';

export const Explain = styled.span`
  font-size: 12px;
  font-weight: 500;
  position: relative;
  padding: 2px;
  border-radius: 2px;
  line-height: 130%;
  color: ${props => props.fontColor};
  background: ${props => props.background};
`;

const StatusLabel = React.memo(
  ({ symbol, status, liabilityRate, ...otherProps }) => {
    const { bgColor, fontColor, desc, label = noop } = useMarginStatusConfig({
      symbol,
      status,
      liabilityRate,
    });

    const content = (
      <Explain fontColor={fontColor} background={bgColor} {...otherProps}>
        {label()}
      </Explain>
    );

    if (desc) {
      return (
        <Tooltip placement="top-end" title={desc?.()}>
          {content}
        </Tooltip>
      );
    }
    return content;
  },
);

export default StatusLabel;
