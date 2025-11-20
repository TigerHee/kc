/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import CopyId from 'Bot/components/Common/CopyId';
import { Text, Flex } from 'Bot/components/Widgets';
import FutureTag from 'Bot/components/Common/FutureTag';

export default ({ children, id, symbolNameText, RightSlot, direction, leverage, ...rest }) => {
  return (
    <div className="parameter-page" {...rest}>
      {(symbolNameText || RightSlot || direction || leverage) && (
        <Flex vc>
          <Text fs={16} fw={700} lh="130%" color="text" as="div" mt={16} mb={16} mr={8}>
            {symbolNameText}
          </Text>
          {RightSlot || <FutureTag direction={direction} leverage={leverage} />}
        </Flex>
      )}

      {children}
      <CopyId id={id} />
    </div>
  );
};
