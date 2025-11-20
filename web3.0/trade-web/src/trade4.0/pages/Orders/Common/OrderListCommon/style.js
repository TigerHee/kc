/**
 * Owner: borden@kupotech.com
 */
import { styled } from '@/style/emotion';
import Divider from '@mui/Divider';
import ScrollWrapper from '@/components/ScrollWrapper';

export const ScrollComp = styled(ScrollWrapper)`
  overflow-x: auto;
  padding: 4px 12px;
  display: flex;
  &.bottomBorder {
    border-bottom: 1px solid;
    border-bottom-color: ${(props) => props.theme.colors.divider4};
  }
`;

export const CardListWrapper = styled.div`
  height: 100%;
  flex: 1;
  padding: 0 12px 16px;
  overflow-y: auto;
`;

export const OrderListHeader = styled.div`
  width: 100%;
  height: 28px;
  padding: 0 12px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
  display: flex;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.colors.text40};

  & > div {
    flex: 1 1 auto;

    & > span {
      display: inline-flex;
      align-items: center;
      height: 100%;
    }

    &:last-of-type {
      text-align: right;
      justify-content: flex-end;
      & > span {
        justify-content: flex-end;
      }
    }
  }

  .mergeColumn {
    display: flex;
    /* text-align: right; */
  }

  &.special {
    height: 40px;
    padding: 0 12px;
    line-height: 16px;
  }

  .KuxDropDown-container {
    height: 100%;
  }

  .dropdown-item {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    padding: 11px 12px;
  }
`;

export const OrderListContent = styled.div`
  height: 100%;
  padding: 0 12px;
  flex: 1;
  overflow-y: auto;
`;

export const ListWrapper = styled.div`
  height: 100%;
  position: relative;
  .KuxSpin-root {
    height: 100%;
    margin-top: 0 !important;
  }
`;

export const LoginWrapper = styled.div`
  height: 100%;
  flex: 1;
  padding: 0 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: ${(props) => props.theme.colors.text};
`;

export const RowItem = styled.div`
  width: 100%;
  height: ${(props) => (props.screen === 'lg1' || props.screen === 'lg2' ? '40px' : '36px')};
  padding: 2px 0;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
  display: flex;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.text};

  &:hover {
    background: ${(props) => props.theme.colors.cover4};
  }

  & > div {
    flex: 1 1 auto;

    & > span {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      height: 100%;
    }

    &:last-of-type {
      text-align: right;
      justify-content: flex-end;
      & > span {
        justify-content: flex-end;
      }
    }
  }
`;

export const CardItem = styled.div`
  margin-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.screen === 'md' || props.screen === 'sm' ? '10px' : '12px')};
`;

export const CardRowHead = styled.div`
  width: 100%;
`;

export const CardRowNormal = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};

  .value {
    color: ${(props) => props.theme.colors.text};
    margin-top: 6px;
  }
  &.oneCloumn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .value {
      margin-top: 0;
    }
  }
  &.threeCloumn {
    width: calc(33.3% - 8px);
    .kfe {
      justify-content: flex-start !important;
    }
    &:nth-of-type(3n + 1) {
      text-align: right;
      .kfe {
        justify-content: flex-end !important;
      }
    }
  }
  &.fourCloumn {
    width: calc(25% - 9px);
    .kfe {
      justify-content: flex-start !important;
    }
    &:nth-of-type(4n + 1) {
      text-align: right;
      .kfe {
        justify-content: flex-end !important;
      }
    }
  }
`;

export const TipContainer = styled.div`
  height: 100%;
  flex: 1;
  padding: 0 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  flex-direction: column;
  color: ${(props) => props.theme.colors.text40};
  .text {
    margin-top: 12px;
  }
  .KuxSpin-root {
    height: 40px;
    flex: none;
  }
`;

export const FooterWrapper = styled.div`
  padding: 24px 12px;
  text-align: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.text40};
`;

export const OrderListFilters = styled.div`
  display: flex;
  align-items: center;

  & > div {
    display: flex;
  }
  a {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.colors.text40};
  }
`;

export const FilterItem = styled.div`
  .dropdown-value {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.colors.text40};
  }

  .dropdown-item {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    padding: 11px 12px;
  }
`;

export const DividerWrapper = styled(Divider)`
  margin: 0 12px;
  height: 12px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    padding-right: 8px;
  }

  .right {
  }

  svg {
    color: ${(props) => props.theme.colors.icon};
    cursor: pointer;
    width: 12px;
    min-width: 12px;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 8px;

  svg {
    color: ${(props) => props.theme.colors.icon};
    cursor: pointer;
    width: 12px;
    min-width: 12px;
    &.active {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

export const HeaderColumnTitleWrap = styled.span`
  display: flex;
  flex: 1;
`;

export const MultiFilterContentWrap = styled.section`
  display: flex;
  height: 24px;
  margin-top: 4px;
  align-items: center;
  justify-content: space-between;

  svg {
    color: ${(props) => props.theme.colors.icon};
    cursor: pointer;
    width: 12px;
    min-width: 12px;
  }

  .active {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const MultiTypeOrderHistoryFilterBarWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 4px 12px 0;
`;
