/**
 * Owner: lena@kupotech.com
 */
import { styled } from '@kux/mui';
import Kyc from 'routes/AccountPage/Kyc/index.js';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyc_page">
      <Kyc />
    </Wrapper>
  );
};
