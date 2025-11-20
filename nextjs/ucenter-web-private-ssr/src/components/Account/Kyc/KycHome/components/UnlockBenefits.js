/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICHookOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 32px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
`;
const Content = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px 24px;
  flex-wrap: wrap;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover2};
`;
const Item = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 15px;
  font-weight: 400;
  line-height: 140%; /* 21px */
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
`;

const UnlockBenefits = ({ list = [] }) => {
  return (
    <Container>
      <Title>{_t('aa15682b7ed64800ad19')}</Title>
      <Content>
        {list.map((item) => (
          <Item key={item}>
            <ICHookOutlined size={16} />
            {item}
          </Item>
        ))}
      </Content>
    </Container>
  );
};

export default UnlockBenefits;
