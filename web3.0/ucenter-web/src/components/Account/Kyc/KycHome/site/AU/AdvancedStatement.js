/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

export const Statement = styled.div`
  margin-top: 20px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
`;

export default () => {
  return <Statement>{_t('au_advanced_kyc_disclaimer')}</Statement>;
};
