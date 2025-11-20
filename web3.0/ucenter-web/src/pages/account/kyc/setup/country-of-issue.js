/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import CountryOfIssue from 'routes/AccountPage/Kyc/Setup/CountryOfIssue';

const Wrapper = styled.div``;
export default () => {
  return (
    <Wrapper data-inspector="account_kyc_setup_countryOfIssue_page">
      <CountryOfIssue />
    </Wrapper>
  );
};
