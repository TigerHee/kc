/**
 * Owner: tiger@kupotech.com
 */
import { ICArrowUpOutlined } from '@kux/icons';
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  .title {
    margin-bottom: 40px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 36px;
    font-style: normal;
    line-height: 130%;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-bottom: 28px;
      font-size: 24px;
    }
  }
  .subTitle {
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-bottom: 24px;
      font-size: 15px;
    }
  }
  .more {
    margin-top: 4px;
    margin-bottom: 28px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 13px;
    font-style: normal;
    line-height: 150%;
    span span {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .KuxAlert-root {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 12px;
    }
  }
  .KuxAlert-icon {
    padding-top: 0;
  }
  .alertTitle {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
  .alertDesc {
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 150%;
    &:not(:last-child) {
      margin-bottom: 4px;
    }
    span span {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .CheckboxWrapper {
    margin-top: 40px;
    margin-bottom: 24px;
  }
`;
export const DownIcon = styled(ICArrowUpOutlined)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
