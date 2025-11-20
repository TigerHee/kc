/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';
import { Text, Flex } from 'Bot/components/Widgets';
import Spin from '@kux/mui/Spin';
import { _t, _tHTML } from 'Bot/utils/lang';
import memStorage from 'utils/memStorage';

export const CSpin = styled(Spin)`
  width: 16px;
  height: 16px;
  .KuxSpin-wrapper,
  img {
    width: 16px;
    height: 16px;
  }
`;

// 启动1s后消失
const Starting = React.memo(({ onFresh }) => {
  React.useEffect(() => {
    setTimeout(() => {
      memStorage.setItem('justCreate', null);
      onFresh();
    }, 10000);
  }, [onFresh]);
  return (
    <Flex vc className="bot-starting">
      <CSpin type="normal" size="xsmall" />
      <Text color="text60" pl={4}>
        {_t('wVGQSXVK2FcczkmpCnAKyU')}
      </Text>
    </Flex>
  );
});
export default Starting;
