/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

export const FreeTaxComponent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    text-align: right;
    [dir='rtl'] & {
      text-align: left;
    }
  }
`;

const FreeTaxText = () => {
  return <FreeTaxComponent>{_t('37429d78a7c94000ae27')}</FreeTaxComponent>;
};

export default FreeTaxText;
