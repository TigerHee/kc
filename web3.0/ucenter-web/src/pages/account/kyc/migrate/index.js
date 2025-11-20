/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import KycMigrate from 'routes/AccountPage/Kyc/Migrate';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyc_migrate_page">
      <KycMigrate />
    </Wrapper>
  );
};
