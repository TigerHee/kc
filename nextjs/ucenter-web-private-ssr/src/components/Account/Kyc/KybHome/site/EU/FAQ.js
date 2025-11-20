import { styled } from '@kux/mui';
import OriginFAQ from 'src/components/Account/Kyc/common/components/FAQ';
import { _t } from 'src/tools/i18n';

const Text = styled.span`
  line-height: 140%;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text40};
`;

export default () => {
  return (
    <OriginFAQ>
      <OriginFAQ.Item title={_t('314220cbe0b64000a220')} description={_t('374a0146acce4800a952')} />
      <OriginFAQ.Item title={_t('2960d139c87a4000a504')} description={_t('fdf824de19b84000ac5b')} />
      <OriginFAQ.Item
        title={_t('0094141bf7c04800af69')}
        description={_t('3d27b646df024000af3a')}
        defaultOpen
      />
      <OriginFAQ.Item title={_t('1648b38a7a604000a010')} description={_t('3562af1f45684000a055')} />
    </OriginFAQ>
  );
};
