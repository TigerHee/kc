import styled from 'emotion/index';
import { space, border, layout } from 'styled-system';
import MDrawer from '../MDrawer';
import ModalHeader from '../ModalHeader';
import ModalFooter from '../ModalFooter';

export const MDialogRoot = styled(MDrawer)`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-width: unset;
  min-height: 320px;
  max-height: calc(100vh - 32px);
  border-radius: 16px 16px 0 0;
  .KuxMDrawer-content {
    display: flex;
    flex-direction: column;
  }
  ${space}
  ${border}
  ${layout}
`;

export const MModalHeader = styled(ModalHeader)`
  padding: 24px 32px;
  .KuxModalHeader-title {
    font-size: 24px;
  }
  .KuxModalHeader-close {
    top: 24px;
  }
`;

export const MModalContent = styled.div`
  flex: 1;
  overflow: auto;
`;

export const MModalFooter = styled(ModalFooter)`
  padding: 16px;
`;
