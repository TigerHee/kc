/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { useState } from 'react';
import OriginFAQ from 'src/components/Account/Kyc/common/components/FAQ';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import { COMPANY_TYPE_LIST } from '../../../config';
import MaterialListDialog from './MaterialListDialog';

const ExUl = styled.ul`
  padding-left: 1em;
  > li {
    list-style-type: initial;
    cursor: pointer;
    text-decoration-line: underline;
    text-underline-offset: 2px;
    + li {
      margin-top: 10px;
    }
  }
`;
const A = styled.span`
  text-decoration-line: underline;
  cursor: pointer;
`;

const FAQ = () => {
  const [companyType, setCompanyType] = useState(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <OriginFAQ>
        <OriginFAQ.Item
          title={_t('f4128a6f81364800a06b')}
          description={
            <ExUl>
              {COMPANY_TYPE_LIST.map((item) => {
                return (
                  <li
                    key={item.value}
                    onClick={() => {
                      setCompanyType(item.value);
                      setOpen(true);
                    }}
                  >
                    {item.title}
                  </li>
                );
              })}
            </ExUl>
          }
          defaultOpen
        />
        <OriginFAQ.Item
          title={_t('6g399duRUgLDBkWraCo9R2')}
          description={_t('3msKgPX4XTfxEaQ1QgofvY')}
        />
        <OriginFAQ.Item
          title={_t('36wkqpPUzccoB4XyspMhHp')}
          description={
            <>
              <div>{_t('1ntkEGvB8E3i1VBxBcEQkh')}</div>
              <div>{_t('ksVtvoTbVadqbcKeNAZqRo')}</div>
            </>
          }
        />
        <OriginFAQ.Item
          title={
            <A
              onClick={() => {
                trackClick(['RealtimeResultJoinGroup', '1']);
                window.open(tenantConfig.kyc.tgUrl);
              }}
            >
              {_t('f56500f821f34800ac02')}
            </A>
          }
        />
      </OriginFAQ>
      <MaterialListDialog open={open} onClose={() => setOpen(false)} companyType={companyType} />
    </>
  );
};

export default FAQ;
