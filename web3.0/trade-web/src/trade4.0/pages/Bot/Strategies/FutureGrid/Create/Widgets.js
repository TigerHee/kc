/**
 * Owner: mike@kupotech.com
 */
import React, { useLayoutEffect, useState } from 'react';
import { ChangeRate } from 'Bot/components/ColorText';
import { Text } from 'Bot/components/Widgets';
import LabelPopover from 'Bot/components/Common/LabelPopover';
import { _t, _tHTML } from 'Bot/utils/lang';
import Row from 'Bot/components/Common/Row';
import { useSelector, useDispatch } from 'dva';


export const Parameter = ({ className }) => (
  <LabelPopover
    className={className}
    label={_t('76RRv418Q2eESJ2LGohsgo')}
    textProps={{ fs: 14, color: 'text' }}
    content={
      <>
        <Text fs={14} fw={500} as="div">
          {_t('futrgrid.pricerange')}
        </Text>
        <Text fs={12} as="p">
          {_t('futrgrid.futurerangehint')}
        </Text>

        <Text fs={14} fw={500} as="div">
          {_t('gridform15')}
        </Text>
        <Text fs={12} as="p">
          {_t('gridformTip6')}
        </Text>
      </>
    }
  />
);
