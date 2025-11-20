/**
 * Owner: willen@kupotech.com
 */
import { px2rem, styled } from '@kufox/mui';
import { isFunction } from 'lodash';

const WrapperBox = styled.section`
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: ${px2rem(1200)};
  padding: ${px2rem(104)} 0;
`;
const Content = styled.div`
  text-align: center;
  max-width: ${px2rem(351)};
`;
const Message = styled.p`
  font-weight: 500;
  font-size: ${px2rem(24)};
  line-height: ${px2rem(38)};
  color: #00142a;
  margin-top: ${px2rem(24)};
`;
const Describe = styled.p`
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  color: rgba(0, 20, 42, 0.6);
  margin-top: ${px2rem(8)};
`;

export default ({ icon, massage, describe }) => {
  return (
    <WrapperBox>
      <Content>
        <img src={icon} alt="" />
        <Message>{isFunction(massage) ? massage() : massage}</Message>
        {!!describe && <Describe>{isFunction(describe) ? describe() : describe}</Describe>}
      </Content>
    </WrapperBox>
  );
};
