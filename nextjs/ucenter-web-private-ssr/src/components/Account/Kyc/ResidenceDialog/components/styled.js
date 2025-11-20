/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';

export const CurResidence = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  margin-bottom: 32px;
  background: ${({ theme }) => theme.colors.cover2};
  p:nth-child(1) {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
  p:nth-child(2) {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    line-height: 140%;
  }
`;

export const ChangeResidence = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  .KuxSelect-disabled {
    .KuxSelect-wrapper {
      background-color: ${({ theme }) => theme.colors.cover2};
    }
  }
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
`;

export const Desc = styled.div`
  color: ${({ theme, error, warn }) =>
    error ? theme.colors.secondary : warn ? theme.colors.complementary : theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const Content = styled.div`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    min-height: 322px;
  }
`;

export const Footer = styled.div`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: flex;
    justify-content: flex-end;
    padding: 20px 32px;
    border-top: 1px solid ${({ theme }) => theme.colors.divider8};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px 16px;
    button {
      width: 100%;
    }
  }
`;
export const MigrateDialog = styled(Dialog)`
  .KuxDialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      width: 320px;
      padding-top: 32px;
    }
  }
`;
export const DialogIcon = styled.img`
  width: 136px;
`;
export const DialogTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
export const DialogDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  margin-top: 8px;
`;
export const DialogButtonGroup = styled.div`
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;
