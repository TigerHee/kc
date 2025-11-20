import { Button, styled } from '@kux/mui';
import createResponsiveMarginCss from 'src/components/Account/Kyc/utils/createResponsiveMarginCss';

export const Container = styled.div`
  ${({ theme }) => createResponsiveMarginCss(theme)};
`;

export const Wrapper = styled.div`
  margin: 26px auto 80px;
  width: 100%;
  max-width: 580px;
  min-height: 50vh;
  .ocrTitle {
    margin-top: 48px;
    margin-bottom: 28px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 24px;
    font-style: normal;
    line-height: 140%;
  }
  .typeIconBox {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    padding: 40px;
    background-color: ${({ theme }) => theme.colors.cover2};
    border-radius: 20px;
  }
  .typeIcon {
    width: 100%;
    max-width: 240px;
  }
  .typeIconNonDoc {
    max-width: 156px;
  }
  .errorExampleList {
    display: flex;
    gap: 24px;
    justify-content: space-between;
  }
  .errorExampleItem {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  .errorExampleItemIcon {
    width: 88px;
  }
  .errorExampleItemDesc {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 140%;
    text-align: center;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
    margin-bottom: 40px;
    .ocrTitle {
      margin-top: 32px;
      margin-bottom: 20px;
    }
    .typeIconBox {
      margin-bottom: 32px;
      padding: 24px 20px;
    }
    .errorExampleList {
      flex-direction: column;
      gap: 20px;
    }
    .errorExampleItem {
      flex-direction: row;
      gap: 12px;
    }
    .errorExampleItemDesc {
      font-size: 12px;
      font-size: 15px;
      text-align: left;
    }
  }
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 40px;
`;

export const SupplierWrapper = styled.div`
  margin: 26px auto 80px;
  width: 100%;
  min-height: 80vh;
  max-width: 580px;
  .supplierContent {
    margin-top: 48px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`;
