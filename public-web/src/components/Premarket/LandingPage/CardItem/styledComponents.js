/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { themeColorCover8 } from 'src/utils/themeSelector';

export const StyledCardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  background: ${(props) => props.theme.colors.cover2};
  &:hover {
    background: ${(props) => props.theme.colors.cover4};
    cursor: pointer;
  }
  .divider {
    width: 0px;
    height: 112px;
    margin: 0 40px;
    border-left: 1px ${themeColorCover8} dashed;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    padding: 32px 40px;
  }
`;

export const LeftWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 360px;
  }
`;

export const RightWrapper = styled.div`
  width: 100%;
  .hr {
    margin: 16px 0 0;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 16px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex: 1;
    margin-top: 0;
  }
`;

export const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  div.dataItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-right: 0;
    margin-bottom: 8px;

    .label {
      padding-right: 16px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
      &.hasDes {
        text-decoration: underline dashed ${(props) => props.theme.colors.text20};
        cursor: help;
        text-underline-offset: 3px;
      }
    }

    .value {
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: column;
      align-items: flex-start;
      margin-right: 16px;
      .label {
        padding-right: 0;
      }

      .value {
        margin-top: 6px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 16px;
        font-style: normal;
        line-height: 130%;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    div.dataItem {
      margin-bottom: 0;
    }
  }
`;
export const PlaceholderWrapper = styled.div`
  color: ${(props) => props.theme.colors.text30};
`;

export const PercentWrapper = styled.div`
  margin-left: 2px;
  color: ${(props) => props.theme.colors.text40};
  &.primary {
    color: ${(props) => props.theme.colors.primary};
  }
  &.secondary {
    color: ${(props) => props.theme.colors.secondary};
  }
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
`;

export const DataValueWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;
export const ButtonWrapper = styled.div`
  button {
    min-width: 80px;
  }
`;
export const OngoingWrapper = styled.div`
  .dataWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .dataWrapper {
      margin-top: 20px;
    }
  }
`;
export const HistoryWrapper = styled.div`
  .timeWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;

    button {
      margin-left: 16px;
    }
  }
`;

export const BottomDataWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  .dataItem {
    .label {
      padding-right: 16px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }

    .value {
      margin-top: 2px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
  }
`;
