/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Popover from 'Bot/components/Common/Popover';
import { Text, Flex } from 'Bot/components/Widgets';
import { MIcons } from './Icon';
import styled from '@emotion/styled';

export const MText = styled.div`
  > div {
    color: #f3f3f3;
    font-size: 14px;
    font-weight: 500;
  }
  > p {
    font-size: 12px;
    margin: 0;
    padding: 0;
    color: rgba(243, 243, 243, 0.6);
  }
  br {
    height: 0;
  }
`;
export default ({ label, content, className, textProps, Icon, ...rest }) => {
  Icon = Icon ?? MIcons.InfoContained;
  if (!label) {
    return (
      <Popover placement="top" content={<MText>{content}</MText>}>
        <Icon size={16} color="icon60" className={className} cursor />
      </Popover>
    );
  }
  return (
    <Flex className={className} vc {...rest}>
      <Text color="text" fs={14} fw={500} lh="130%" {...textProps}>
        {label}
      </Text>
      <Popover placement="top" content={<MText>{content}</MText>}>
        <Icon size={16} color="icon60" className="ml-4" cursor />
      </Popover>
    </Flex>
  );
};
