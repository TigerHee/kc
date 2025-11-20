/**
 * Owner: willen@kupotech.com
 */
import { css, styled } from '@kux/mui';

export const Container = styled.div`
  max-height: 162px;
  padding: 16px 24px;
  background: ${(props) => props.theme.colors.overlay};
  overflow: hidden;
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 128px;
    max-height: 162px;
  }

  .noBalance {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 107px;
    color: ${(props) => props.theme.colors.text40};
    font-size: 16px;
    text-align: center;
    a {
      color: ${(props) => props.theme.colors.primary};
    }

    .link_for_a {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  .flexBox {
    display: flex;
    flex-direction: row;
  }
  .infoBox {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .title {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .titleRight {
    display: flex;
    align-items: center;
  }
  .btnBox {
    // width: 82px;
    display: flex;
    align-items: center;
    & > span {
      display: inline-block;
      width: 0;
      height: 24px;
      margin-right: 16px;
      margin-left: 17px;
      border-left: 1px solid #c2ccd9;
      transform: translate3d(0, 1px, 0);
    }
    button {
      // width: 48px;
      height: 28px;
      padding: 0 8px;
      text-align: center;
      border-radius: 4px;
    }
  }
  .infoVerticalItem {
    margin-top: 13px;
    color: ${(props) => props.theme.colors.text60};
    font-size: 12px;
    .label {
      display: inline-block;
      height: 20px;
      margin-bottom: 7px;
    }
    .content {
      margin-bottom: 10px;
    }
  }
  .tabs {
    display: flex;
    align-items: center;
  }
  .selector {
    margin-left: 20px;
  }
`;

export const DebtRatio = styled.span`
  font-weight: 500;
  font-size: 24px;
  font-style: italic;
`;

export const InfoItem = styled.div`
  margin-top: 13px;
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
`;

export const currencyCss = css`
  font-size: 14px;
`;

export const currencyValueCss = css`
  color: ${(props) => props.theme.colors.text40};
`;
