/**
 * Owner: john.zhang@kupotech.com
 */

import { Select, styled, useResponsive } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const SelectText = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  height: 48px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  gap: 8px;
`;

const SelectTips = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
`;

const BeforeTaxDate = () => (
  <SelectText>
    <span>{_t('d851de8d5a4d4000a0cc')}</span>
    <SelectTips>{_t('49f5ced02f594000a2d6')}</SelectTips>
  </SelectText>
);
const AfterTaxDate = () => (
  <SelectText>
    <span>{_t('abd82dcd0c804000ab3e')}</span>
    <SelectTips>{_t('eff88a7737884800a64b')}</SelectTips>
  </SelectText>
);

const TaxSelect = (props) => {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  return (
    <Select
      placeholder={_t('24805280f9324800a76c')}
      size="large"
      options={[
        {
          label: <BeforeTaxDate />,
          value: true,
        },
        { label: <AfterTaxDate />, value: false },
      ]}
      style={{ width: isH5 ? '100%' : 300 }}
      {...props}
    />
  );
};

export default TaxSelect;
