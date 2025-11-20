import { Button, styled } from '@kux/mui';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px 20px;
  gap: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover2};
  margin-top: 12px;
`;
export const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  & > div {
    display: flex;
    gap: 8px;
  }
`;
export const BenefitItem = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  display: flex;
  align-items: center;
  gap: 4px;
`;
export const ExButton = styled(Button)`
  min-width: 285px;
  max-width: 285px;
  display: flex;
  gap: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    min-width: 100px;
  }
`;
export const GapBox = styled.div`
  display: flex;
  flex-direction: ${({ dir = 'column' }) => dir};
  gap: ${({ gap = 8 }) => gap}px;
`;
export const WarningBox = styled(GapBox)`
  color: ${({ theme }) => theme.colors.complementary};
  > div:first-child {
    font-weight: 500;
    font-size: 15px;
    line-height: 140%; /* 21px */
  }
  div:nth-child(2) {
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
  }
`;
export const RejectReasonBox = styled(GapBox)`
  color: ${({ theme }) => theme.colors.secondary};
  > div:first-child {
    font-weight: 500;
    font-size: 15px;
    line-height: 140%; /* 21px */
  }
  div:nth-child(2) {
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
  }
  .rejectContent {
    padding-left: 4px;
  }
`;
export const Icon = styled.img`
  display: block;
  width: 18px;
  height: 18px;
`;
export const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.divider8};
`;
export const CollectInfoBox = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-family: 'KuFox Sans';
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  display: flex;
  flex-direction: column;
  gap: 10px;
  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 1em;
    color: ${({ theme }) => theme.colors.text30};
    font-size: 15px;
    list-style: disc;
    list-style: disc;
  }
  li > span {
    color: ${({ theme }) => theme.colors.text};
  }
`;
