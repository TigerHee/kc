/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2022-12-31 09:38:54
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-25 21:55:48
 * @FilePath: /trade-web/src/trade4.0/components/StTag/index.js
 * @Description:
 */

import React from 'react';
import { _t, _tHTML, addLangToPath } from 'utils/lang';
import { styled, fx, colors, withMedia } from '@/style/emotion';
import Tooltip from '@mui/Tooltip';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';

const StSpan = styled.span`
  font-weight: 500;
  font-size: 12px;
  margin-left: 2px;
  ${(props) => fx.color(props, 'secondary')};
`;

const TooltipWrapper = styled(Tooltip)`
  ${(props) => fx.color(props, 'text')};
  background: ${(props) => props.theme.colors.tip} !important;
  a {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const StTag = () => {
  const moreLink = isDisplayFeeInfo() ? addLangToPath('/support/360003256193') : "/";
  return (
    <TooltipWrapper
      title={
        <span onClick={e => e.stopPropagation()}>
          {_tHTML('market.st.tips', { moreLink })}
        </span>
      }
    >
      <StSpan>*st</StSpan>
    </TooltipWrapper>
  );
};

export default React.memo(StTag);
