/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

export const FreeTaxComponent = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 48px;
  width: max-content;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    line-height: 140%;
  }
`;

const FreeTaxText = () => {
  return <FreeTaxComponent>{_t('37429d78a7c94000ae27')}</FreeTaxComponent>;
};

export default FreeTaxText;
