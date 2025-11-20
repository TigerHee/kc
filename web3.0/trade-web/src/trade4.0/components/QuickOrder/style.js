/*
 * @Owner: gannicus.zhou@kupotech.com
 */
import styled from '@emotion/styled';
import withAuth from '@/hocs/withAuth';
import InputNumber from '@mui/InputNumber';

export const QuickOrderWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 999;
  display: flex;
  flex-wrap: wrap;
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.layer};
  width: min-content;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  .qo_loading {
    padding-right: 4px;
    vertical-align: -2px;
  }
`;

export const MoveDiv = styled.div`
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
`;

const OrderButton = withAuth(styled.div`
  position: relative;
  cursor: pointer;
  min-width: 100px;
  padding: 0px 4px;
  height: 48px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  color: ${(props) => props.theme.colors.text};
  > span {
    user-select: none;
    white-space: nowrap;
  }
  ${(props) => {
    if (props.loading) {
      return `
        pointer-events: none;
        cursor: not-allowed;
      `;
    }
  }}
`);

export const BuyDiv = styled(OrderButton)`
  background-color: ${(props) => props.theme.colors.primary};
`;
export const SellDiv = styled(OrderButton)`
  background-color: ${(props) => props.theme.colors.secondary};
`;

export const NumDiv = styled.div`
  min-width: 100px;
  width: min-content;
  .KuxInputNumber-input {
    text-align: center;
    font-size: 14px;
  }
  fieldset {
    top: -6px;
    border-radius: 0px;
  }
  .KuxForm-itemHelp {
    display: none;
  }
`;

export const CloseDiv = styled.div`
  cursor: pointer;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  .qo_text {
    width: 12px;
    height: 12px;
    color: #8c8c8c;
    margin: 0 2px;
  }
`;

export const UpArea = styled.div`
  position: relative;
  display: flex;
  flex: 1 0 100%;
  font-size: 12px;
  text-align: center;
  height: 48px;
  ${(props) => {
    if (props.showVerify) {
      return `
        border-bottom: 1px solid ${props.theme.colors.divider8};
      `;
    }
  }}
  border-radius: 8px;
`;

export const StyledInputNumber = styled(InputNumber)`
  height: 48px;
  display: flex;
  flex-direction: column;
  padding: 7px 4px;
  label {
    position: static;
    transform: none;
    height: 50%;
    display: flex;
    font-size: 12px;
    align-items: center;
    white-space: nowrap;
    justify-content: center;
    color: ${props => props.theme.colors.text60};
  }
  input {
    height: 50%;
    font-size: 12px !important;
    margin-top: 2px;
    &::placeholder {
      font-size: 12px;
    }
  }
  fieldset {
    display: none;
  }
`;
