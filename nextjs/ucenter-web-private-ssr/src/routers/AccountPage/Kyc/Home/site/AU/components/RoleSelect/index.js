/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICCheckboxArrowOutlined } from '@kux/icons';
import { useTheme } from '@kux/mui';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import { AU_KYC2_BENEFITS, AU_KYC3_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_ROLE_ENUM } from 'src/constants/kyc/enums';
import { _t, _tHTML } from 'src/tools/i18n';
import useResponsiveSSR from '@/hooks/useResponsiveSSR';

import {
  RoleContent,
  RoleOptionBenefitItem,
  RoleOptionBenefits,
  RoleOptionContainer,
  RoleOptionTitle,
} from './styled';

const RoleOption = ({ label, benefits = [], children }) => {
  const theme = useTheme();
  return (
    <RoleOptionContainer>
      <RoleOptionTitle>{label}</RoleOptionTitle>
      {benefits.length ? (
        <RoleOptionBenefits>
          <span>{_t('9aad14b268854800acdb')}</span>
          {benefits.map((benefit) => (
            <RoleOptionBenefitItem key={benefit}>
              <ICCheckboxArrowOutlined size={14} color={theme.colors.primary} />
              {benefit}
            </RoleOptionBenefitItem>
          ))}
        </RoleOptionBenefits>
      ) : null}
      {children}
    </RoleOptionContainer>
  );
};

const RoleSelect = ({ value, disabled, onChange }) => {
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  return (
    <CustomSelect
      size={isH5 ? 'medium' : 'xlarge'}
      label={_t('2581f1ca2a064800a44a')}
      name="role"
      options={[
        {
          value: KYC_ROLE_ENUM.RETAIL,
          label: (inner) => {
            const label = <span>{_t('bfc5bba3a05d4000aee9')}</span>;
            return inner ? (
              label
            ) : (
              <RoleOption label={label} benefits={AU_KYC2_BENEFITS()}>
                <RoleContent>
                  <div>{_tHTML('86d50771594a4000a7d6')}</div>
                  <ul>
                    <li>{_t('857aaa9042ac4800abcb')}</li>
                    <li>{_t('ececbc2ef5714000acbe')}</li>
                  </ul>
                </RoleContent>
              </RoleOption>
            );
          },
        },
        {
          value: KYC_ROLE_ENUM.WHOLESALE,
          label: (inner) => {
            const label = <span>{_t('fe1ca2d7db3c4000a34b')}</span>;
            return inner ? (
              label
            ) : (
              <RoleOption label={label} benefits={AU_KYC3_BENEFITS()}>
                <RoleContent>
                  <div>{_tHTML('ba1593ce5b244800abce')}</div>
                  <ol>
                    <li>{_tHTML('5c25dfabcbc64000a982')}</li>
                    <li>{_tHTML('au_kyc_wholesale_require_doc')}</li>
                    <li>{_t('f3aa4aa56c264000a5bc')}</li>
                  </ol>
                </RoleContent>
              </RoleOption>
            );
          },
        },
      ]}
      value={value}
      onChange={onChange}
      disabled={disabled}
      divider
    />
  );
};

export default RoleSelect;
