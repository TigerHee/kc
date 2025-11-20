/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';
import Dialog from '@mui/Dialog';
import Box from '@mui/Box';
import CoinIcon from '@/components/CoinIcon';

export const TabWrapper = styled(Box)`
  .KuxModalHeader-close {
    top: 50%;
    transform: translate(0, -50%);
  }

  [role='tablist'] {
    height: 88px;
  }

  .KuxTabs-container {
    height: 88px;
  }
`;

export const DialogWrapper = styled(Dialog)`
  .KuxModalHeader-root {
    padding: 0 32px;
    height: 88px !important;
  }
  .KuxDialog-content {
    padding-top: 32px;
  }
`;

export const Tip = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const CoinSelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CoinSelectTitle = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const CoinSelectTabItem = styled.div`
  cursor: pointer;
  border-radius: 8px;
  flex: 1;
  padding: 16px;

  background: ${(props) =>
    (props.active ? props.theme.colors.primary8 : 'transparent')};
  border: 1px solid
    ${(props) =>
      (props.active ? props.theme.colors.primary : props.theme.colors.divider8)};

  &:last-of-type {
    margin-left: 12px;
  }
`;

export const CoinSelectTabDesc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;

  color: ${(props) => props.theme.colors.text40};
  margin-left: 32px;
`;

export const CoinIconPro = styled(CoinIcon)`
  span {
    font-weight: 700;
    font-size: 16px;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text};
    margin-left: 5px;
  }
`;

export const CoinIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CanBorrowWrapper = styled.div`
  margin-top: ${props => (props.isRepay ? 0 : '12px')};
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

export const BorrowBtn = styled.span`
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text60};
`;
