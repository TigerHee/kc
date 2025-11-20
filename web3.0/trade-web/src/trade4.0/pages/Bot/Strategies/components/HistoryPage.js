/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import Empty from '@mui/Empty';

export default ({ isEmpty, isShowHint, children, ...rest }) => {
  isShowHint = isShowHint === undefined ? isEmpty : isShowHint;
  return (
    <div className="overflowX fullHeight" {...rest}>
      {!isEmpty && (
        <>
          {children}
          {isShowHint && (
            <Text color="text40" as="p" className="Flex hv vc fs-12 pt-6">
              {_t('stoporders8')}
            </Text>
          )}
        </>
      )}
      {isEmpty && <Empty />}
    </div>
  );
};
