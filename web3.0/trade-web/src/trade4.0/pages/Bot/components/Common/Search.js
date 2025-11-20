/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import { MIcons } from 'Bot/components/Common/Icon';
import Input from '@mui/Input';
import styled from '@emotion/styled';

const MSearch = styled(Input)`
  padding-left: 12px;
  fieldset {
    border-radius: 30px;
    background-color: ${({ theme }) => theme.colors.cover4};
    border-color: ${({ focus, theme }) => (focus ? theme.colors.primary : 'transparent')};
  }
`;
export default React.memo((props) => {
  const [focus, setFocus] = useState(false);
  return (
    <MSearch
      focus={focus}
      allowSearch
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      prefix={<MIcons.Search size={16} color="icon60" />}
      size="small"
      {...props}
    />
  );
});
