/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';

export const Wrapper = styled.section`
  .kyc_privacy_protect {
    justify-content: flex-start;
    margin-top: 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .BaseCardBottomWrapper {
      margin-top: 24px;
    }
  }
`;
export const PIWrapper = styled.div`
  .KuxStep-stepContent {
    flex: 1;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 24px;
    border-top: 1px solid ${({ theme }) => theme.colors.divider8};
    .KuxStep-stepContent {
      margin-bottom: 24px;
      margin-left: 8px;
    }
  }
`;
export const StepTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 1px;
    margin-bottom: 6px;
    font-size: 16px;
    line-height: 130%;
  }
`;
export const StepDesc = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const PIFlowWrapper = styled.div`
  margin-top: 20px;
  padding: 24px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.cover2};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 12px;
    padding: 16px 16px 24px;
    .KuxButton-root {
      width: 100%;
      height: 40px;
    }
  }
`;
export const PIFlowTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 150%;
  }
`;
export const PIFlowDesc = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;
export const PIFlowErrorWrapper = styled.div`
  margin-top: 28px;
  .inlineFlex {
    display: inline-flex;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;

export const RejectedAlert = styled(BaseAlert)`
  & span > span {
    text-decoration: underline;
  }
`;
export const VerifyingAlert = styled(BaseAlert)`
  margin-top: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;
export const RejectedButtonBox = styled.div`
  margin-top: 16px;
`;
export const UnverifiedButtonBox = styled.div`
  margin-top: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;
