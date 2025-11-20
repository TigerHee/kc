import React, { useState, useCallback } from 'react';
import { Dropdown, styled, Select } from '@kux/mui';
import { ICArrowUpOutlined } from '@kux/icons';
import { useSelector } from 'react-redux';
import Overlay from './Overlay';
import useLang from '../../../../hookTool/useLang';
import { namespace } from '../../model';
import { CountrySelectOption } from '../CountrySelectOption';

const DropdownCustom = styled(Dropdown)`
  width: 100%;
  .KuxDropDown-trigger {
    width: 100%;
  }
`;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  .KuxSelect-root {
    pointer-events: none;
    .countryOptionItem {
      height: 56px;
    }
  }
`;
const DownIcon = styled(ICArrowUpOutlined)`
  font-size: 20px;
  transform: ${({ open }) => (open ? 'rotateZ(0deg)' : 'rotateZ(-180deg)')} !important;
  color: ${({ theme }) => theme.colors.text};
`;

export default ({ disabled, label, onChange, value, handleGA }) => {
  const { _t } = useLang();
  const { countries = [] } = useSelector((state) => state[namespace] || {});
  const [open, setOpen] = useState(false);

  // 国家选择选项
  const countryOptions = CountrySelectOption(countries);

  const onHandleClick = useCallback(
    (v) => {
      onChange(v);
      setOpen(false);
      handleGA('InfoEdit1Country', '1', {});
    },
    [onChange, handleGA],
  );

  return (
    <DropdownCustom
      overlay={
        <Overlay
          onHandleClick={onHandleClick}
          countryOptions={countryOptions}
          activeValue={value}
        />
      }
      visible={open}
      onVisibleChange={(v) => setOpen(v)}
      popperStyle={{ width: '100%', transform: 'translateX(0px)' }}
      trigger="click"
      placement="bottom-start"
      popperClassName="customDropdown"
    >
      <Wrapper
        onClick={() => {
          setOpen(true);
        }}
        disabled={disabled}
      >
        <Select
          size="xlarge"
          value={value}
          label={label}
          placeholder={_t('kyc.verification.info.country.select')}
          options={countryOptions}
          dropdownIcon={<DownIcon open={open} />}
        />
      </Wrapper>
    </DropdownCustom>
  );
};
