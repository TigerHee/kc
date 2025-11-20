/**
 * Owner: victor.ren@kupotech.com
 */
import styled from 'emotion/index';

export const FormItemLabel = styled.label`
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  font-family: ${({ theme }) => theme.fonts.family};
  color: ${({ theme }) => theme.colors.text60};
  position: relative;
  &:before {
    content: '*';
    display: ${({ isRequired, requiredMark }) =>
      isRequired && requiredMark ? 'inline-block' : 'none'};
    margin-right: 4px;
    font-size: 12px;
  }
`;

export const FormItemErrorLabel = styled.div`
  padding-left: 16px;
  font-size: 12px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.family};
  color: ${({ theme, type }) => theme.colors[type]};
  flex: 1;
  width: 100%;
`;

export const FormItemContainer = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const HelperWrapper = styled.div`
  min-height: 20px;
  display: flex;
`;
