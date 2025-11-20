/*
 * owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import { _t } from 'Bot/utils/lang';
import styled from '@emotion/styled';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import Select from '@mui/Select';
import { FormItem } from 'Bot/components/Common/CForm';

const MSelect = styled(Select)`
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.cover4};
  > label {
    transform: translate(14px, 10px) scale(1) !important;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text20};
  }
  svg.ICTriangleTop_svg__icon {
    fill: ${({ theme }) => theme.colors.icon};
  }
  fieldset {
    top: 0;
    border-color: ${({ theme, focus }) => (focus ? theme.colors.primary : 'transparent')};
  }
  legend {
    display: none;
  }
  .KuxSelect-wrapper {
    > div {
      left: unset;
      right: 16px;
    }
  }
`;
/**
 * @description: 多币种选择器
 * @return {*}
 */
export default React.memo(({ symbol }) => {
  const { base, quota } = useSpotSymbolInfo(symbol);
  const [focus, setFocus] = useState(false);
  return (
    <FormItem label={_t('cointype')} noStyle name="useBaseCurrency">
      <MSelect
        searchIcon={false}
        matchWidth
        placement="bottom-end"
        focus={focus}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        options={[
          { label: quota, value: 0, title: quota },
          { label: `${base}+${quota}`, value: 1, title: `${base}+${quota}` },
        ]}
      />
    </FormItem>
  );
});
