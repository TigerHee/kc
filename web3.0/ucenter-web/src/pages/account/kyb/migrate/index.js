/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import KybMigrate from 'routes/AccountPage/Kyc/KybMigrate/index';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyb_migrate_page">
      <KybMigrate />
    </Wrapper>
  );
};
