/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Text } from 'Bot/components/Widgets';
import LabelPopover from 'Bot/components/Common/LabelPopover';
import { _t, _tHTML } from 'Bot/utils/lang';

export const Parameter = ({ className, gridPrStr }) => {

  return (
    <LabelPopover
      className={className}
      label={_t('76RRv418Q2eESJ2LGohsgo')}
      textProps={{ fs: 14, color: 'text' }}
      content={
        <>
          <Text fs={14} fw={500} as="div">
            {_t('minprice')}
          </Text>
          <Text fs={12} as="p">
            {_t('minpricehint')}
          </Text>

          <Text fs={14} fw={500} as="div">
            {_t('pergridpr')}
          </Text>
          <Text fs={12} as="p">
            {_t('pergridprhint', { range: gridPrStr })}
          </Text>
        </>
      }
    />
  );
};
