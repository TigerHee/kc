/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import InputNumber from '@mui/InputNumber';
import { eTheme } from '@/utils/theme';
import CoinCurrency from '@/components/CoinCurrency';
import FastButtonGroup from '@/components/FastButtonGroup';
import InputWithToolTip from '@/components/InputWithTooltip';
import { withYScreen } from '@/pages/OrderForm/config';

export const StyledInputWithToolTip = withYScreen(styled(InputWithToolTip)`
  margin-top: 10px;
  position: relative;
  ${props => props.$useCss(['md', 'sm'])(`
    margin-top: 5px;
  `)}
  ${(props) => {
    // 隐身，主要是成交额的获取(Form.useWatch('volume', form))，需要成交额输入框还在dom中
    if (props.isHidden) {
      return `
        width: 0;
        height: 0;
        margin: 0;
        display: block;
        overflow: hidden;
      `;
    }
  }}
`);
export const PercentButtons = withYScreen(styled(FastButtonGroup)`
  margin-top: 8px;
  ${props => props.$useCss(['md', 'sm'])(`
    margin-top: 5px;
  `)}
  ${props => props.$useCss('sm')(`
    & > button {
      height: 16px;
    }
  `)}
`);

export const PercentButtonsSuffix = styled(FastButtonGroup)`
  height: 100%;
  > button {
    height: 100%;
    padding: 0 11px;
    margin-left: 8px;
    color: ${eTheme('text60')};
  }
`;

export const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  opacity: ${(props) => (props.isMarket ? 0 : 1)};
  user-select: none;
  &.disabled_minus {
    .KuxInputNumber-controlDown {
      pointer-events: none;
      opacity: 0.5;
    }
  }
  ${(props) => {
    if (props.ellipsis) {
      return `
        > input {
          text-overflow: ellipsis;
        }
      `;
    }
  }}
`;

export const StyledCoinCurrency = styled(CoinCurrency)`
  color: inherit;
`;

export const MarketPrice = withYScreen(styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text30};
  background: ${(props) => props.theme.colors.cover4};
  border: 1px dashed ${(props) => props.theme.colors.divider8};
  z-index: 1;
  ${props => props.$useCss('sm')(`
    font-size: 12px;
  `)}
`);

export const OrderButtonsBox = withYScreen(styled.div`
  margin: 16px 0;
  ${props => props.$useCss(['md', 'sm'])(`
    margin: 10px 0;
  `)}
`);


export const ExpectedVolume = withYScreen(styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   font-size: 12px;
   margin-top: 10px;
   flex-wrap: wrap;
`);

export const ExpectedVolumeTitle = withYScreen(styled.div`
  color: ${(props) => props.theme.colors.text40};
`);

export const ExpectedVolumeNumber = withYScreen(styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
    color: ${(props) => props.theme.colors.text};
`);


export const ExpectedFormatNumber = withYScreen(styled.div`
    color: ${(props) => props.theme.colors.text};
`);

export const ExpectedLine = withYScreen(styled.div`
   color: ${(props) => props.theme.colors.text40};
`);

export const ExpectedUnit = withYScreen(styled.div`
   color: ${(props) => props.theme.colors.text};
   margin-left: 4px;
`);

export const TimeSeparator = withYScreen(styled.div`
  color: ${(props) => props.theme.colors.text20};
  font-size: 14px;
  font-weight: 500;
  margin: 0px 8px;
`);
