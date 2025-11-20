/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';
import { _t } from 'Bot/utils/lang';
import Tabs from '@kux/mui/Tabs';

export default function ({ items, current, onChange }) {
  const onChangeHandle = (e, val) => {
    onChange(val);
  };
  return (
    <Tabs
      variant="bordered"
      activeType="primary"
      type="text"
      value={current}
      onChange={onChangeHandle}
    >
      {items.map((item, index) => {
        return (
          <Tabs.Tab
            key={item.value}
            label={_t(item.label)}
            value={item.value}
          />
        );
      })}
    </Tabs>
  );
}
