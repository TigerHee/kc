/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import Method from 'routes/AccountPage/Kyc/Setup/Method';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyc_setup_method_page">
      <Method />
    </Wrapper>
  );
};
