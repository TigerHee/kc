/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';

/** 样式开始 */
const Text = styled.div`
  font-size: 12px;
  line-height: 130%;
  text-align: left;
  white-space: nowrap;
`;
const Label = styled(Text)`
  color: ${props => props.theme.colors.text40};
  ${props => props.theme.breakpoints.down('sm')} {
    font-size: 10px;
  }
`;
const Value = styled(Text)`
  font-weight: 500;
  margin-top: 2px;
  color: ${props => props.theme.colors.text};
`;
/** 样式结束 */

const MarketInfo = React.memo(({ isFold, label, value, className, ...otherProps }) => {
  return (
    <div
      className={classNames('infobar-market-info', { [className]: className })}
      {...otherProps}
    >
      <Label>{label}</Label>
      <Value>{value}</Value>
    </div>
  );
});

export default MarketInfo;
