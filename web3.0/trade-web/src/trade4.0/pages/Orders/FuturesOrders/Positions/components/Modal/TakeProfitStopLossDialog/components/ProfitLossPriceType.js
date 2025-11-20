/**
 * Owner: clyne@kupotech.com
 */
import React, { useState, useMemo } from 'react';

import _ from 'lodash';
import { _t } from 'utils/lang';
import { styled } from '@kux/mui/emotion';
import { Select } from '@kux/mui';

import { TOGGLES } from '../constants';

const StyledSelectContent = styled.div`
  .KuxSelect-dropdownIcon {
    margin-left: 2px;
    margin-top: 2px;
  }
  .KuxSelect-wrapper {
    font-size: 16px;
    font-weight: 500;
  }
`;

const StyledSelect = styled(Select)``;

const ProfitLossPriceType = ({ value, onChange }) => {
  const selectOptions = _.map(TOGGLES, (item) => {
    return { ...item, label: _t(item.label) };
  });

  return (
    <StyledSelectContent>
      <StyledSelect
        value={value}
        classNames={{
          dropdownContainer: 'selectContainer',
        }}
        placement={'bottom'}
        listItemHeight={40}
        noStyle
        options={selectOptions}
        matchWidth={false}
        exclusive
        onChange={onChange}
        size="small"
      />
    </StyledSelectContent>
  );
};

export default React.memo(ProfitLossPriceType);
