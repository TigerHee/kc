import styled from 'emotion/index';
import { color, space, border, layout, typography } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

export const ModalFooterRoot = styled('div', {
  shouldForwardProp,
})(
  (props) => `
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  border-top: ${props.border ? `1px solid ${props.theme.colors.divider8}` : 'none'};
  ${props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`,
  color,
  space,
  border,
  typography,
  layout,
);

export const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  button {
    flex: ${(props) => (props.centeredButton ? 1 : 'unset')};
    margin-right: 12px;
  }
  button:last-of-type {
    margin-right: 0;
  }
`;
