/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import OriginFAQ from '../../../common/components/FAQ';

const ExUl = styled.ul`
  padding-left: 1em;
  li {
    list-style: disc;
  }
`;

const FAQ = () => {
  return (
    <OriginFAQ>
      <OriginFAQ.Item title={_t('7841f99f3cde4800a441')} description={_t('53b853549cc64800a8f6')} />
      <OriginFAQ.Item
        title={_t('3ed5ed48ab214000a25f')}
        description={
          <ExUl>
            <li>{_t('e9de75d97d904800af6c')}</li>
            <li>{_t('1a7bf403339a4800a3e0')}</li>
            <li>{_t('9373163a21eb4000a290')}</li>
          </ExUl>
        }
        defaultOpen
      />
      <OriginFAQ.Item
        title={_t('35f0dc72e3cc4800a1f8')}
        description={
          <div>
            <span>{_t('3b478cf680664800a9b2')}</span>
            <ExUl>
              <li>{_t('b1569003062f4800a0ec')}</li>
              <li>{_t('3f8fe72356044000a3d2')}</li>
              <li>{_t('5bd6ae2733204800a1a8')}</li>
            </ExUl>
            <span>{_t('3f8fe72356044000a3d2')}</span>
          </div>
        }
      />
    </OriginFAQ>
  );
};

export default FAQ;
