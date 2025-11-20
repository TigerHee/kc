/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import IdentityType from 'routes/AccountPage/Kyc/Setup/IdentityType';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyc_setup_identityType_page">
      <IdentityType />
    </Wrapper>
  );
};
