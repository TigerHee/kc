/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import { MIcons } from 'Bot/components/Common/Icon';
import Popover from 'Bot/components/Common/Popover';
import { Text } from 'Bot/components/Widgets';

const InfoPopover = ({ key, toastHintConfig }) => {
  if (!toastHintConfig[key]) return null;
  return (
    <Popover
      placement="top"
      content={
        <>
          <Text fs={14} fw={500} as="div">
            {_t(key)}
          </Text>
          <Text fs={12} as="p">
            {_tHTML(toastHintConfig[key].content)}
          </Text>
        </>
      }
    >
      <MIcons.InfoContained size={16} color="icon60" className="ml-4" cursor />
    </Popover>
  );
};
export default InfoPopover;
