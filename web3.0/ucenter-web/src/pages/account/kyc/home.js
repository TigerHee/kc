/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import Home from 'routes/AccountPage/Kyc/Home';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyc_home_page">
      <Home />
    </Wrapper>
  );
};
