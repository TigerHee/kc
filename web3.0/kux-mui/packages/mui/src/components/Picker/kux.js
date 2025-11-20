import MDrawer from 'components/MDrawer';
import styled from 'emotion/index';
import ModalFooter from 'components/ModalFooter';

export const DateWrapper = styled(MDrawer)`
  border-radius: 16px 16px 0 0;
  .KuxDrawer-content {
    padding: 0 16px 16px;
  }
`;

export const InputLine = styled.div`
  width: 100%;
  display: flex;
`;

export const Input = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 1px solid
    ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.cover12)};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text};
  letter-spacing: 0.1px;
  cursor: pointer;
`;

export const ArrowWrapper = styled.div`
  height: 40px;
  margin: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  [dir='rtl'] & {
    svg {
      transform: rotate(180deg);
    }
  }
`;

export const Footer = styled(ModalFooter)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

export const ExtraWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
`;

export const ExtraItem = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text60};
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.primary12};
    color: ${(props) => props.theme.colors.primary};
  }
  &.selected {
    background: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
`;
