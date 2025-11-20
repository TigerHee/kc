/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import { useSelector } from 'react-redux';
import { useStyle } from 'src/components/Account/Kyc/InstitutionalKyc/InstitutionalKycForm/style';
import { _t } from 'tools/i18n';

const CountryOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const useCountryOptions = () => {
  const countries = useSelector((state) => state.kyc.countriesKYB ?? []);
  const theme = useTheme();
  const classes = useStyle({ color: theme.colors, breakpoints: theme.breakpoints });

  return countries
    .filter((i) => [3].includes(i?.regionType))
    .map((item) => {
      if (item.code === 'OT') {
        return {
          label: (isInSelectInput) => {
            return (
              <div>
                {item.name}
                {item.code === 'OT' && !isInSelectInput ? (
                  <div css={classes.autoCompleteTip}>{_t('kyc.country.other')}</div>
                ) : null}
              </div>
            );
          },
          value: item.code,
          title: item.name,
        };
      }
      return {
        label: () => {
          return (
            <CountryOption>
              <img src={item.icon} width={24} height={16} alt="country" />
              {item.name}
            </CountryOption>
          );
        },
        value: item.code,
        title: item.name,
      };
    });
};

export default useCountryOptions;
