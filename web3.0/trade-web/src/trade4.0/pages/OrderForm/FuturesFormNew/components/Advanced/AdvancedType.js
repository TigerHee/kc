/**
 * Owner: garuda@kupotech.com
 */
import React, { useState } from 'react';

import Form from '@mui/Form';
import KuxSelect from '@mui/Select';

import { IconLabel } from './commonStyle';
import { ADVANCED_TYPES } from './config';

import { _t, styled } from '../../builtinCommon';
import { ADVANCED_POST_ONLY } from '../../config';
import { useGetYSmall } from '../../hooks/useGetData';

const AdvancedTypeBox = styled.div`
  margin-top: 4px;
`;

const Select = styled(KuxSelect)`
  background-color: ${(props) => props.theme.colors.cover4};

  fieldset {
    border-color: ${(props) => (props.open ? props.theme.colors.primary : 'transparent')};
  }
`;

const { FormItem } = Form;
const AdvancedType = ({ name }) => {
  // const form = useFormInstance();
  const [open, setOpen] = useState(false);

  const isYScreenSM = useGetYSmall();

  return (
    <AdvancedTypeBox>
      <IconLabel>
        <span>{_t('advanced.type')}</span>
      </IconLabel>
      <FormItem noStyle name={name} initialValue={ADVANCED_POST_ONLY}>
        <Select
          size={isYScreenSM ? 'small' : 'medium'}
          open={open}
          fullWidth
          options={ADVANCED_TYPES}
          // placeholder={_t('futures.advanced.tips')}
          onDropDownVisibleChange={(v) => setOpen(v)}
        />
      </FormItem>
    </AdvancedTypeBox>
  );
};

export default React.memo(AdvancedType);
