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
      <OriginFAQ.Item title={_t('ada875c676bb4800ac1b')} description={_t('3144974740a94800aa88')} />
      <OriginFAQ.Item
        title={_t('e4398cbd1a604000ab6a')}
        description={_t('9d34bf13fc4b4000a4c8')}
        defaultOpen
      />
      <OriginFAQ.Item
        title={_t('9bb62ad2f0614800ab2c')}
        description={
          <div>
            <span>{_t('afe4ce464da04800a45a')}</span>
            <ExUl>
              <li>{_t('ab078375d6c24000a1cd')}</li>
              <li>{_t('3ff3a526daea4000abe7')}</li>
            </ExUl>
          </div>
        }
      />
      <OriginFAQ.Item title={_t('390834d8094c4000a15e')} description={_t('f74d14ab8b134800a571')} />
    </OriginFAQ>
  );
};

export default FAQ;
