import { Button, styled } from '@kux/mui';

export const Container = styled.div`
  display: flex;
  padding: 32px 32px 28px;
  flex-direction: column;
  gap: 32px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
    padding: 16px;
  }
`;
export const Layout = styled.div`
  display: flex;
  gap: 32px;
`;
export const LayoutLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  overflow: hidden;
`;
export const LayoutRight = styled.div``;
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
  }
`;
export const Title = styled.div`
  color: ${({ theme, isEmpty }) => (isEmpty ? theme.colors.text40 : theme.colors.text)};
  font-size: 28px;
  font-weight: 700;
  line-height: 140%; /* 39.2px */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    font-size: 26px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
`;
export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.cover8};
`;
export const Content = styled.div`
  display: flex;
  padding: 24px 24px 28px;
  flex-direction: column;
  gap: 28px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.cover2};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
  }
`;
export const Benefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text60};
  & > div:first-child {
    flex: 1;
    color: ${({ theme }) => theme.colors.text40};
  }
  & > div:nth-child(2) {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    & > div:nth-child(2) {
      gap: 8px;
    }
  }
`;
export const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
  }
`;
export const Divider2 = styled(Divider)`
  background: ${({ theme }) => theme.colors.divider8};
`;
export const CollectInfos = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: disc;
  padding-left: 1em;
  color: ${({ theme }) => theme.colors.text40};
  li {
    line-height: 140%;
  }
`;
export const CollectInfoItem = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;
export const ContinueAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  color: ${({ theme }) => theme.colors.complementary};
`;
export const FailAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  color: ${({ theme }) => theme.colors.secondary};
  u {
    cursor: pointer;
  }
`;
export const ExButton = styled(Button)`
  display: flex;
  gap: 4px;
  min-width: 172px;
`;
export const Img = styled.img`
  width: 136px;
  height: 136px;
`;
export const Icon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
`;
