/**
 * Owner: john.zhang@kupotech.com
 */

import { Checkbox, styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const AgreementRow = styled.div`
  display: flex;
  align-items: center;
  margin: 40px 0 24px 0;
  font-size: 14px;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 32px 0 20px 0;
  }
  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const TaxCheckBox = ({ onChange, checked }) => {
  const handleChange = (val) => {
    const checked = val.target?.checked;
    onChange(checked);
  };
  return (
    <AgreementRow>
      <Checkbox checked={checked} onChange={handleChange} size="small" />
      <div>
        <span>{_t('76315e9a16e54800a90c')}</span>
      </div>
    </AgreementRow>
  );
};

export default TaxCheckBox;
