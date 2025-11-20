/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const CotentWrapper = styled.div`
  padding: 20px 0 8px;
  .KuxForm-itemHelp {
    display: none;
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
    }
  }

  .KuxDivider-horizontal {
    margin: 20px 0;
  }

  .account-item-container {
    .title {
      margin-bottom: 12px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 15px;
      font-style: normal;
      line-height: 130%;
    }
    .desc {
      margin-top: -4px;
      margin-bottom: 12px;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 16px 0;
    .account-item-container {
      .title {
        margin-bottom: 16px;
        font-size: 18px;
      }
      .desc {
        margin-top: -8px;
        margin-bottom: 16px;
      }
    }

    .KuxDivider-horizontal {
      margin: 24px 0;
    }
  }
`;
export const DescWrapper = styled.div`
  .numWrapper {
    color: ${(props) => props.theme.colors.text};
  }
`;
export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
    object-fit: cover;
    border-radius: 24px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
  }
`;
export const AssetsWrapper = styled.div`
  margin-top: 12px;
  color: ${(props) => props.theme.colors.text};
  .label {
    margin-right: 2px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
  .value {
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 16px;
  }
`;

export const KCSDescWrapper = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};

  .link {
    margin-left: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
    &.unStake {
      margin-top: 16px;
    }
  }
`;
export const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }

  > button {
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }
`;
export const ButtonWrapper = styled.div`
  padding: 24px 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 20px 0 32px;
  }
`;
