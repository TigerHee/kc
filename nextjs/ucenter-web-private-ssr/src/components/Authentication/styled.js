/**
 * Owner: lori@kupotech.com
 */

import { Form, styled } from '@kux/mui';

export const IdentityForm = styled(Form)`
  max-width: 860px;
  margin: 0 auto;

  .rc-upload {
    width: 100% !important;
    height: 240px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    .rc-upload {
      width: 100% !important;
      height: 143px;
    }
    .KuxForm-itemHelp {
      height: 12px;
      min-height: 12px;
    }
  }
`;

export const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  padding: 10px;
`;

export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  padding-bottom: 64px;
  img {
    width: 120px;
    height: 120px;
  }
`;

export const Des = styled.div`
  font-size: 14px;
  padding-bottom: 12px;
  color: ${(props) => props.theme.colors.mask};
  text-align: center;
  line-height: 20px;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  padding: 12px 0 6px 0;
  color: ${(props) => props.theme.colors.text};
`;

export const ScanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0 auto;
  padding-top: 48px;
`;

export const Kyc2InApp = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0 auto;
`;

export const DesInApp = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  padding: 24px 0;
  text-align: center;
`;

export const Loading = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ResultBtn = styled.div`
  min-width: 200px;
`;

export const FormItemTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
