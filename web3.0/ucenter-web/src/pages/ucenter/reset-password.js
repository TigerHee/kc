/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import ForgetPwd from 'routes/Ucenter/ForgetPwd';

const ResetContainer = styled.div`
  width: 100%;
  flex: 1;
`;
export default () => {
  return (
    <ResetContainer data-inspector="reset_password_page">
      <ForgetPwd />
    </ResetContainer>
  );
};
