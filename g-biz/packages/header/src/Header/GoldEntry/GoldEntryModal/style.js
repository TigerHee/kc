import { styled } from '@kux/mui/emotion';

export const StyledFundWalletModal = styled.div`
  padding-bottom: 32px;
  .title {
    margin-bottom: 6px;
    font-weight: 400;
    ${(props) => props.theme.fonts.size.xl}
    color: ${({ theme }) => theme.colors.text40};
  }
  .mt24 {
    margin-top: 24px;
  }
`;

export const StyledDepositModal = styled.div`
  .title {
    margin-bottom: 12px;
    font-weight: 400;
    ${(props) => props.theme.fonts.size.xl}
    color: ${({ theme }) => theme.colors.text40};
  }
  .mt24 {
    margin-top: 24px;
  }
`;

export const StyledItem = styled.div`
  margin-top: 12px;
  padding: 32px 24px 32px 20px;
  background-color: ${(props) =>
    props.type === 'primary' ? props.theme.colors.primary4 : props.theme.colors.cover2};
  border: ${(props) =>
    props.type === 'primary' ? `1px solid ${(props) => props.theme.colors.primary20}` : 0};
  border-radius: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    width: 50px;
    height: 50px;
    margin-right: 16px;
  }
  .main {
    flex: 1;
    padding-right: 16px;
    .title {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      ${(props) => props.theme.fonts.size.x2l}
    }
    .desc {
      margin-top: 4px;
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 400;
      ${(props) => props.theme.fonts.size.lg}
      line-height: 150%;
    }
  }
  .skip-arrow {
    width: 20px;
    height: 20px;
  }
`;

export const WrapperIcon = styled.div`
  display: inline-block;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;
