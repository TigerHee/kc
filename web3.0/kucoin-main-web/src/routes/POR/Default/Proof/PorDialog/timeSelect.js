/**
 * Owner: odan.ou@kupotech.com
 */

import React, { useMemo, useState } from 'react';
import { Select, Box } from '@kufox/mui';
import { showDateTimeByZoneEight } from 'helper';

/**
 * 时间选择器
 * @param {{
 *  list: {auditDate: number}[],
 *  value: any,
 *  onChange(value): void,
 * }} props
 */
const TimeSelect = (props) => {
  const { value, onChange, list } = props;
  const options = useMemo(() => {
    return list?.map(({ auditDate }) => ({
      label: `${showDateTimeByZoneEight(auditDate)} UTC+8`,
      value: auditDate,
    }));
  }, [list]);
  return (
    <Box width="180px">
      <Select
        placeholder="请选择"
        size="small"
        options={options}
        fullWidth
        noStyle
        value={value}
        onChange={onChange}
        style={{ maxHeight: 20 }}
      />
    </Box>
  );
};

export default TimeSelect;
