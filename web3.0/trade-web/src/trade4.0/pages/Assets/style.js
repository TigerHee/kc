/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 12px;
  height: 100%;
  overflow: auto;
`;

export const PositionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 130%;
`;

export const SelectWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  margin-bottom: ${props => (props.isTradeAndNotMd ? 0 : '8px')};

  .KuxDropDown-container {
    margin: 0;
  }
`;

export const EyeWrapper = styled.div`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

export const LabelValueWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 130%;
  margin-top: 8px;
`;

export const Label = styled.div`
  font-size: 12px;
  line-height: 130%;
  font-weight: ${(props) => (props.bold ? 500 : 400)};
  color: ${(props) =>
    (props.highlight ? props.theme.colors.text : props.theme.colors.text60)};
  cursor: ${(props) => (props.underline ? 'help' : 'unset')};
  border-bottom: ${(props) =>
    (props.underline ? `1px dashed ${props.theme.colors.text40}` : 'unset')};
`;

export const Value = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) =>
    (props.empty ? props.theme.colors.text40 : props.theme.colors.text)};
`;

export const MainAccount = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
  line-height: 130%;
  font-weight: 500;
`;

export const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    flex: 1;
    font-size: 12px;
    padding: 0;

    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }
`;

export const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: ${(props) => (props.md ? 'row' : 'column')};
  flex-wrap: wrap;
  margin-bottom: 12px;

  > div {
    width: ${(props) => (props.md ? '50%' : '100%')};

    &:nth-of-type(even) {
      padding-left: ${(props) => (props.md ? '18px' : 0)};
    }

    &:nth-of-type(odd) {
      padding-right: ${(props) => (props.md ? '18px' : 0)};
    }
  }
`;

export const ColWrapper = styled.div`
  &.responsive {
    width: 100% !important;
    display: flex;
    > div {
      width: 50%;

      &:nth-of-type(even) {
        padding-left: 20px;
      }
    }
  }
`;

export const SvgWrapper = styled.div`
  width: 18px;
  height: 16px;
  position: relative;
`;

export const SvgInner = styled.div`
  width: 4px;
  height: 4px;
  position: absolute;
  border: 1px solid #737e8d;
  border-radius: 50%;
  position: absolute;
  top: 7px;
  left: 7px;

  transform: rotate(0deg);

  &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 1px;
    background-color: #737e8d;
    right: 3px;
    top: 50%;
    transform: translate(0, -50%);
    border-radius: 50%;
  }
`;

export const GaugeSvg = styled.svg`
  position: relative;
`;

export const PercentWrapper = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors[props.fontColor]};
`;

export const RiskValueWrapper = styled.div`
  display: flex;
  align-items: ${(props) => (props.md ? 'space-between' : 'start')};
  flex-direction: ${(props) => (props.md ? 'row' : 'column')};
  justify-content: ${(props) => (props.md ? 'space-between' : 'start')};

  > div:last-of-type {
    margin-top: ${(props) => (props.md ? '0' : '8px')};
  }
`;

export const TradeTypeBox = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.text60};
  opacity: ${props => (props.isTradeAndMd ? 0 : 1)};
`;
