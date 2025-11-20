/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import clxs from 'classnames';
import { styled } from '@/style/emotion';
import { eTheme } from '@/utils/theme';

const PhaseInfoTitleDiv = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${eTheme('text40')};
  margin: 16px 0 4px;
  &.ca_active {
    color: ${eTheme('text')};
  }
`;

const PhaseInfoTitle = (props) => {
  const { title, style, isActive, className } = props;
  return (<PhaseInfoTitleDiv
    style={style}
    className={clxs(className, { ca_active: isActive })}
  >
    {title}
  </PhaseInfoTitleDiv>);
};

export default PhaseInfoTitle;
