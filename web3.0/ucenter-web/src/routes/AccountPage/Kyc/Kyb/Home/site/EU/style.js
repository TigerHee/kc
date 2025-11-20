/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const StatusCardWrapper = styled.div`
  padding: 24px 32px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  .KuxSteps-steps {
    width: 100%;
  }
  .companyName {
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 28px;
    font-style: normal;
    line-height: 140%;
  }
  .companyNameDisable {
    color: ${({ theme }) => theme.colors.text40};
  }
  .regionName {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
  }
  .divider {
    width: 100%;
    height: 1px;
    margin: 32px 0;
    background: ${({ theme }) => theme.colors.divider8};
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    .companyName {
      font-size: 24px;
    }
    .regionName {
      font-size: 14px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
    border: 0;
    .companyName {
      margin-bottom: 8px;
      font-size: 20px;
    }
    .regionName {
      font-size: 14px;
    }
    .divider {
      margin: 24px 0;
    }
  }
`;
