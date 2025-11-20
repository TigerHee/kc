/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const AlertContainer = styled.div`
  margin: 8px auto 16px auto;
  display: flex;
  justify-content: center;
`;

export const Wrapper = styled.div``;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 54px;
`;

export const SecurityForm = styled.div`
  display: inline-block;
  width: 100%;
`;

export const ContainerClass = css`
  max-width: 1036px;
  width: 100%;
  transition: all 0.3s ease;
  padding: 0 36px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 12px;
  }
`;

export const AlertContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  line-height: 150%;
`;
