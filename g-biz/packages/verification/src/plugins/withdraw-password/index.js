/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import InnerFormItem from '../../components/InnerFormItem';
import { METHODS } from '../../constants';
import HelpCategory from '../../components/HelpCategory';
import { cryptoPwd } from '../../utils/crypto';
import useLang from '../../hooks/useLang';
import { tenantConfig } from '../../config/tenant';
import withdrawPasswordSrc from '../../../static/withdraw_password.png';
import withdrawPasswordDarkSrc from '../../../static/withdraw_password.dark.png';
import { FormInput } from '../../components/commonUIs';

export const field = METHODS.WITHDRAW_PASSWORD;

export const beforeSubmit = (form) => {
  return [field, cryptoPwd(form.getFieldValue(field) ?? '')];
};

export const Name = (props) => {
  const { _t } = useLang();
  return <span {...props}>{_t('71c5a52283604000aae2')}</span>;
};

const Image = styled.img`
  width: 32px;
  height: 32px;
`;
export const Icon = (props) => {
  const { currentTheme = 'light' } = useTheme();
  const map = {
    light: withdrawPasswordSrc,
    dark: withdrawPasswordDarkSrc,
  };
  return <Image src={map[currentTheme] ?? map.light} alt="icon" {...props} />;
};

export const VerifyItem = ({ value, onValueChange, onReFocus }) => {
  const { _t } = useLang();

  return (
    <InnerFormItem label={_t('da8288689e3a4000a1f4')} name={field}>
      <FormInput
        inputProps={{ className: 'security-verify-input' }}
        type="password"
        value={value}
        addonAfter={null}
        size="xlarge"
        onFocus={() => onReFocus(field)}
        allowClear
        prefix={<div />}
        onChange={(e) => {
          const { value = '' } = e.target ?? {};
          onValueChange(value);
        }}
      />
    </InnerFormItem>
  );
};

export const HelpItem = (props) => {
  const { _t } = useLang();

  return (
    <HelpCategory
      title={_t('da8288689e3a4000a1f4')}
      items={[
        {
          label: _t('3ad11b92eb274000ad69'),
          onClick: () => {
            window.open(tenantConfig.withdrawPathwordJumpUrl, '_blank');
          },
        },
      ]}
      {...props}
    />
  );
};

/** 插件是否启用 */
export const enable = () => true;
