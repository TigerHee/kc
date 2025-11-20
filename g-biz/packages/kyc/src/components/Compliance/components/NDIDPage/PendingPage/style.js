/**
 * Owner: tiger@kupotech.com
 */
import { styled, Dialog } from '@kux/mui';
import { ICTransferOutlined } from '@kux/icons';

export const Content = styled.div`
  .PageTitle {
    margin-bottom: 12px;
  }
  .desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 28px;
    text-align: center;
    color: ${({ theme }) => theme.colors.text40};
  }
  .countdownBox {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .countdownItem {
    display: flex;
    align-items: center;
    &:first-of-type {
      margin-right: 24px;
    }
  }
  .number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 48px;
    position: relative;
    font-size: 24px;
    font-weight: 700;
    border-radius: 4px;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text};
    box-shadow: 0px 2px 3px 0px ${({ theme }) => theme.colors.cover12};
    background-color: ${({ theme }) => theme.colors.layer};
    &::before {
      content: '';
      display: flex;
      width: 40px;
      height: 24px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: ${({ theme }) => theme.colors.cover4};
      border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
    }
  }
  .unit {
    font-size: 14px;
    font-weight: 500;
    line-height: 130%;
    margin-left: 6px;
    color: ${({ theme }) => theme.colors.text40};
  }
  .linkBox {
    text-align: center;
    border-radius: 12px;
    padding: 36px 48px 28px;
    margin-top: 36px;
    background-color: ${({ theme }) => theme.colors.cover2};
  }
  .linkLogoBox {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .linkLogo {
    width: 40px;
    height: 40px;
    /* border-radius: 8px; */
  }
  .linkDesc {
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    margin-top: 24px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.text};
  }
  .linkId {
    font-size: 14px;
    font-weight: 400;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.text40};
  }
  .tips {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
    margin-top: 24px;
    color: ${({ theme }) => theme.colors.text40};
  }
  /* ${({ theme }) => theme.breakpoints.down('sm')} {
    .linkBox {
      padding: 36px 48px 28px;
      margin-top: 36px;
    }
    .linkLogo {
      width: 40px;
      height: 40px;
    }
  } */
  &.isSmStyle {
    .linkBox {
      padding: 36px 20px 28px;
      margin-top: 40px;
    }
    .linkLogo {
      width: 52px;
      height: 52px;
    }
  }
`;

export const TransIcon = styled(ICTransferOutlined)`
  font-size: 20px;
  flex-shrink: 0;
  margin: 0 40px;
  color: ${({ theme }) => theme.colors.icon60};
`;

export const StyledDialog = styled(Dialog)`
  /* .KuxButton-root {
    flex: 1;
  } */
`;
export const ResultWrapper = styled.div`
  text-align: center;
  padding-top: 32px;
  .resultImg {
    width: 148px;
    height: 148px;
  }
  .resultTitle {
    font-size: 20px;
    font-weight: 600;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.text};
  }
  .resultDesc {
    margin-top: 12px;
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    color: ${({ theme }) => theme.colors.text60};
  }
`;
