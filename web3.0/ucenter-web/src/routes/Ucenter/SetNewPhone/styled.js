/**
 * Owner: willen@kupotech.com
 */

import { css, Form, styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 520px;
  max-width: 520px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

export const FormWrapper = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('md')} {
    padding-bottom: 40px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-bottom: 40px;
  }
`;

export const AreaCode = styled.div`
  width: 50px;
`;

export const sendBtn = css`
  margin-left: 12px;
  padding: 0 8px;
  cursor: pointer;
`;

export const Title = styled.div`
  padding-bottom: 24px;
  font-size: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

export const AlertPrompt = styled.div`
  width: 488px;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
