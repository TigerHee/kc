/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICArrowRightOutlined, ICArrowLeftOutlined } from '@kux/icons';
import useIsRTL from '../hooks/useIsRTL';

export const Category = styled.div`
  & + & {
    margin-top: 32px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-top: 26px;
    }
  }
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
  margin-bottom: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 12px 0;
  }
`;

export const Item = styled.div`
  padding: 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const ArrowRightIcon = styled(ICArrowRightOutlined)`
  color: ${({ theme }) => theme.colors.icon60};
`;

const ArrowLeftIcon = styled(ICArrowLeftOutlined)`
  color: ${({ theme }) => theme.colors.icon60};
`;

export default function HelpCategory({ title, onlyOne, items }) {
  const isRTL = useIsRTL();
  return (
    <Category>
      {onlyOne ? null : <Title>{title}</Title>}
      <Content>
        {items.map((item) => (
          <Item key={item.label} onClick={item.onClick}>
            {item.label}
            {isRTL ? <ArrowLeftIcon size={16} /> : <ArrowRightIcon size={16} />}
          </Item>
        ))}
      </Content>
    </Category>
  );
}
