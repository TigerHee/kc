/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { ReactComponent as ArrowDown } from 'assets/eth-merge/arrow-down.svg';
import { Divider } from '@kufox/mui';

const getChangeRateColor = changeRate => (changeRate < 0 ? '#ED6666' : '#21C397');
// --- 样式start ---
export const Index = styled.section`
  margin: 64px 16px 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const List = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  /* height: 783px; */
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #4440ff;

  @media (min-width: 1040px) {
    ::-webkit-scrollbar {
      background: transparent;
      width: 6px;
      height: 2px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: rgba(0, 20, 42, 0.2);
    }
  }
`;

export const SectionHeader = styled.h3`
  width: 240px;
  margin-bottom: 17px;
  text-align: center;

  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
`;

export const ItemWrapper = styled.div`
  padding: 16px;
  padding-bottom: 0;
  border-bottom: 1px solid rgba(68, 64, 255, 0.3);
  display: flex;
  flex-direction: column;
`;

export const ItemSubject = styled.h4`
  margin-bottom: 12px;
  span {
    padding: 2px 4px;
    background: #4200ff;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    /* or 18px */

    color: #ffffff;
  }
`;

export const ItemDesc = styled.p`
  margin-bottom: 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  /* identical to box height, or 16px */

  color: #ffffff;

  opacity: 0.4;
`;

export const CurrencyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px 0;
  &:not(:last-of-type) {
    border-bottom: 1px solid rgba(68, 64, 255, 0.16);
  }
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-of-type) {
    margin-bottom: 14px;
  }
`;

export const CurrencyName = styled.div`
  display: flex;
  span:first-of-type {
    margin-right: 3px;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    /* or 18px */

    color: #ffffff;
  }
  span:last-of-type {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    /* or 18px */

    color: #ffffff;

    opacity: 0.4;
  }
`;

export const CurrencyLinks = styled.div`
  display: flex;
  align-items: center;
  a {
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid #4440ff;
    padding: 2px 8px;
  }
`;

export const LinkDivider = styled(Divider)`
  height: 13px;
  margin: 0 10px;
  background: rgba(141, 88, 255, 0.2);
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  & > span:first-of-type {
    margin-bottom: 4px;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    /* identical to box height, or 16px */

    color: #ffffff;

    opacity: 0.2;
  }
`;

export const Price = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  /* or 18px */

  color: #ffffff;

  opacity: 0.6;
`;

export const ChangeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

export const ChangeRate = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${props => getChangeRateColor(props.value)};
  &:last-of-type {
    margin-left: 2px;
    opacity: 0.6;
    font-size: 12px;
  }
`;

export const FooterWrapper = styled.div`
  position: ${({ expand }) => (expand ? 'auto' : 'absolute')};
  bottom: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  width: 100%;
  background: #000e1d;

  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  /* or 18px */

  color: #4440ff;
`;

export const StyledArrowDown = styled(ArrowDown)`
  margin-left: 4px;
  color: inherit;
  ${({ expand }) => expand && `transform: rotate(180deg);`}
`;

// --- 样式end ---
