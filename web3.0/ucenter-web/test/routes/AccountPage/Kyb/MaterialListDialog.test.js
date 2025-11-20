import MaterialListDialog from 'src/routes/AccountPage/Kyc/Kyb/Home/components/MaterialListDialog';
import { COMPANY_TYPE } from 'src/routes/AccountPage/Kyc/config';
import { customRender } from 'test/setup';

describe('material list', () => {
  it('companyType is NORMAL', () => {
    customRender(<MaterialListDialog open={true} companyType={COMPANY_TYPE.NORMAL} />, {});
  });
  it('companyType is LARGE_ENTERPRISES', () => {
    customRender(<MaterialListDialog open={true} companyType={COMPANY_TYPE.LARGE_ENTERPRISES} />, {});
  });
  it('companyType is INDIVIDUAL_ENTERPRISE', () => {
    customRender(<MaterialListDialog open={true} companyType={COMPANY_TYPE.INDIVIDUAL_ENTERPRISE} />, {});
  });
  it('companyType is PARTNERSHIP', () => {
    customRender(<MaterialListDialog open={true} companyType={COMPANY_TYPE.PARTNERSHIP} />, {});
  });
  it('companyType is FINANCIAL_INSTITUTION', () => {
    customRender(<MaterialListDialog open={true} companyType={COMPANY_TYPE.FINANCIAL_INSTITUTION} />, {});
  });
  it('companyType is OTHER', () => {
    customRender(<MaterialListDialog open={true} companyType={COMPANY_TYPE.OTHER} />, {});
  });
});
