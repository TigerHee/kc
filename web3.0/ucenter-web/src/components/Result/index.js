/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import { isFunction } from 'lodash';

const WrapperBox = styled.section`
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  padding: 200px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 100px 0;
  }
`;
const Content = styled.div`
  text-align: center;
  max-width: 529px;
`;
const Message = styled.p`
  font-weight: 500;
  font-size: 28px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 16px;
`;
const Describe = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-top: 16px;
  padding: 0 16px;
`;

export default ({ icon, massage, describe, result }) => {
  return (
    <WrapperBox data-inspector="authorize_result_page" data-result={result}>
      <Content>
        <img src={icon} alt="icon" />
        <Message>{isFunction(massage) ? massage() : massage}</Message>
        {!!describe && <Describe>{isFunction(describe) ? describe() : describe}</Describe>}
      </Content>
    </WrapperBox>
  );
};
