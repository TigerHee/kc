/**
 * Owner: tiger@kupotech.com
 */
/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Input, styled } from '@kux/mui';
import { ICArrowDownOutlined } from '@kux/icons';
import Picker from './Picker';
import useLang from '../../../../../../hookTool/useLang';

export const TriggerBox = styled.div`
  width: 100%;
  .KuxInput-root {
    pointer-events: none;
  }
`;
const DownIcon = styled(ICArrowDownOutlined)`
  font-size: 16px;
  color: ${({ disabled }) => (disabled ? 'var(--color-text40)' : 'var(--color-text)')};
`;

const format = 'YYYY/MM/DD';

export default props => {
  const { _t } = useLang();
  const { label, value, onChange, minDate, maxDate, placeholder, disabled } = props;
  const [show, setShow] = useState(false);
  const [curValue, setCurValue] = useState(value || moment());

  useEffect(() => {
    if (show && value) {
      setCurValue(value);
    }
  }, [value, show]);

  return (
    <>
      <TriggerBox
        onClick={() => {
          if (disabled) return;
          setShow(true);
        }}
      >
        <Input
          size="xlarge"
          label={label}
          value={value ? moment(value).format(format) : ''}
          addonAfter={<DownIcon />}
          labelProps={{ shrink: true }}
          placeholder={placeholder}
          disabled={disabled}
        />
      </TriggerBox>

      <Picker
        value={curValue}
        show={show}
        title={label}
        onClose={() => setShow(false)}
        onCancel={() => setShow(false)}
        onOk={() => {
          onChange(curValue);
          setShow(false);
        }}
        onChange={setCurValue}
        cancelText={_t('0cb2c3e437f04000a47a')}
        okText={_t('f14ecdf869994000ab89')}
        minDate={minDate || moment().subtract(100, 'years')}
        maxDate={maxDate || moment().add(10, 'years')}
        format={format}
      />
    </>
  );
};
