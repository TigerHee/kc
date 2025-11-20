import React, { forwardRef } from 'react';
import { Input } from '@kux/design';
import { useTranslation } from 'tools/i18n';
// import styles from './styles.module.scss';

interface Props {
  value?: string;
  label?: string;
  onFocus?: (e) => void;
  onBlur?: (e) => void;
  onChange?: (e) => void;
  className?: string;
  autoComplete?: string;
  prefix?: React.ReactNode;
}

function InputEye(props: Props, ref) {
  const { value, onFocus, onBlur, label, ...rest } = props;
  const { t } = useTranslation('entrance');

  const handleFocus = (e) => {
    typeof onFocus === 'function' && onFocus(e);
  };

  const handleBlur = (e) => {
    typeof onBlur === 'function' && onBlur(e);
  };

  return (
    <div>
      <Input
        data-inspector="password_input_with_eye"
        type="password"
        label={label || t('dNbUwkPyY3HWTPa27wAQ9A')}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={() => {}}
        fullWidth
        allowClear
        {...rest}
        ref={ref}
      />
    </div>
  );
}

export default forwardRef(InputEye);
