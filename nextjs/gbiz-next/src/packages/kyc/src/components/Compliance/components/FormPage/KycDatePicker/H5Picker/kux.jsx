/**
 * Owner: tiger@kupotech.com
 */
import { styled, MDrawer, ModalFooter } from '@kux/mui';

export const DateWrapper = styled(MDrawer)`
  border-radius: 16px 16px 0 0;
  min-width: 300px;
  .KuxDrawer-content {
    padding: 0 16px 16px;
  }
`;

export const InputLine = styled.div`
  width: 100%;
  display: flex;
`;

export const InputLineContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 1px solid
    ${(props) => (props.active ? 'var(--color-primary)' : 'var(--color-cover12)')};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--color-text);
  letter-spacing: 0.1px;
  cursor: pointer;
`;

export const Footer = styled(ModalFooter)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;
