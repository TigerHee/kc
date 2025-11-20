import styled from 'emotion/index';
import ModalHeader from '../ModalHeader';

export const MModalHeaderRoot = styled(ModalHeader)`
  height: 56px;
  padding: 0 16px;
  .KuxModalHeader-back,
  .KuxModalHeader-close {
    width: 28px;
    height: 28px;
  }
  .KuxModalHeader-title {
    font-size: 18px;
  }
  .KuxModalHeader-back {
    svg {
      width: 18px;
      height: 18px;
    }
  }
  .KuxModalHeader-close {
    top: 14px;
    right: 16px;
    svg {
      width: 10px;
      height: 10px;
    }
  }
`;
