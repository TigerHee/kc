/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Container = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: ${({ theme }) => theme.colors.text60};
`;

export const TermFooter = styled.div`
  padding: 0 32px 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 16px 16px;
  }
  .termFooterContent {
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.cover4};
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.04);
    padding: 16px;
  }
  .termFooterTitle {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    color: ${({ theme }) => theme.colors.text};
  }
  .termFooterDescList {
    margin: 16px 0;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    color: ${({ theme }) => theme.colors.text};
  }
  .footerDescListItem {
    display: flex;
  }
  .termFooterBtnBox {
    display: flex;
    gap: 12px;
    .btn {
      flex: 1;
    }
  }
  .alert {
    margin-top: 16px;
  }
`;
