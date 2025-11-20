/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _t } from 'Bot/utils/lang';
import { MIcons } from 'Bot/components/Common/Icon';
import { Text, Flex } from 'Bot/components/Widgets';
import styled from '@emotion/styled';

const MFlex = styled(Flex)`
  text-align: right;
`;
export default ({ active, onClick }) => {
  const text = _t(active ? 'gridform3' : 'gridform2');
  return (
    <MFlex vc onClick={onClick} cursor>
      <Text color="primary" fs={12} title={text} pr={2}>
        {text}
      </Text>
      {active ? (
        <MIcons.Delete size={12} color="primary" />
      ) : (
        <MIcons.Edit size={12} color="primary" />
      )}
    </MFlex>
  );
};
