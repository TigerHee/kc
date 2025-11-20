/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Text } from 'Bot/components/Widgets';
import { _t } from 'Bot/utils/lang';
import { Div } from './OpenOrdersStartOk';

const StartOk = React.memo(({ isActive }) => {
  return (
    <div className="startok" hidden={!isActive}>
      <div className="egg center pt-32 mt-32">
        <Div className="bgi-action-warn" />
      </div>
      <Text color="text60" className="fs-14 center" as="div">
        {_t('orderpaused')}
      </Text>
    </div>
  );
});

export default StartOk;
