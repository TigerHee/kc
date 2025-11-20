/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import DarkIcon from '@/assets/bot/bgicons/stopprofitover-dark.svg';
import LightIcon from '@/assets/bot/bgicons/stopprofitover-light.svg';

export const Div = styled.div`
  display: inline-block;
  width: 148px;
  height: 148px;
  background-image: ${({ theme }) => {
    return `url(${theme.currentTheme === 'dark' ? DarkIcon : LightIcon})`;
  }};
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const StartOk = React.memo(({ isActive, title = 'openorder6', desc = 'zzguadan' }) => {
  return (
    <div className="startok" hidden={!isActive}>
      <div className="egg center pt-32 mt-32">
        <Div className="bgi-action-success" />
      </div>
      <Text color="text" className="mb-8 center" as="div">
        {_t(title)}
      </Text>
      <Text color="text60" className="fs-14 center" as="div">
        {_t(desc)}
      </Text>
    </div>
  );
});

export default StartOk;
