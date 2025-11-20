/**
 * Owner: vijay.zhou@kupotech.com
 */
import InnerFormItem from '../../components/Verification/components/FormItem';
import { METHODS } from '../../enums';
import { cryptoPwd } from '../../utils/crypto';
import useLang from '../../hooks/useLang';
import { Input } from '@kux/design';
import { FormInstance } from 'rc-field-form';
import { IIconProps, LoginpasswordThinIcon } from '@kux/iconpack';

export const field = METHODS.LOGIN_PASSWORD;

export const beforeSubmit = (form: FormInstance) => {
  return [field, cryptoPwd(form.getFieldValue(field) ?? '')];
};

export const Name = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { t } = useLang();
  return <span {...props}>{t('login.password')}</span>;
};

export const Icon = (props: IIconProps) => {
  return <LoginpasswordThinIcon {...props} />;
};

export const VerifyItem = ({ value, onValueChange, onReFocus }) => {
  const { t } = useLang();

  return (
    <InnerFormItem label={t('login.password')} name={field}>
      <Input
        type="password"
        value={value}
        addonAfter={null}
        size="medium"
        onFocus={() => onReFocus(field)}
        allowClear
        inputProps={{ autoComplete: 'new-password' }}
        prefix={<div />}
        onChange={(e) => {
          const { value = '' } = e.target ?? {};
          onValueChange(value);
        }}
      />
    </InnerFormItem>
  );
};

/** 插件是否启用 */
export const enable = () => true;

/** 是验证码插件 */
export const isOTP = () => true;
