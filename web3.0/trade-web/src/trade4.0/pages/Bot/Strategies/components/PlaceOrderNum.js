/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';
import { Text, Flex } from 'Bot/components/Widgets';

export default ({ buyNum, sellNum }) => {
  if (!buyNum && !sellNum) return null;
  return (
    <Flex>
      <Text color="primary">{buyNum}</Text>
      <Text color="text60" pl={2} pr={2} ft={600}>
        :
      </Text>
      <Text color="secondary">{sellNum}</Text>
    </Flex>
  );
};
