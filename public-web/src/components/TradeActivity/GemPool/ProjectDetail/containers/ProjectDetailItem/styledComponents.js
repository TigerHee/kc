/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledPoolItem = styled.div`
  width: 100%;
  display: block;
  border-radius: 16px;
  position: relative;
  padding: 24px;
  background: ${(props) => props.theme.colors.cover2};

  .KuxDivider-horizontal {
    margin: 32px 0;
  }

  .mark {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    height: 28px;
    padding: 0 12px;
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    border-radius: 0px 15px;
    &.notStart {
      color: ${(props) => props.theme.colors.complementary};
      background: ${(props) => props.theme.colors.complementary8};
    }

    &.inProcess {
      color: ${(props) => props.theme.colors.textPrimary};
      background: ${(props) => props.theme.colors.primary8};
    }

    &.completed {
      color: ${(props) => props.theme.colors.text60};
      background: ${(props) => props.theme.colors.cover4};
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 24px 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 40px;
    .KuxDivider-horizontal {
      margin: 40px 0;
    }
  }
`;
export const StyledH5PoolItem = styled.div`
  width: 100%;
  position: relative;

  &.withTag {
    padding-top: 22px;
  }

  .container {
    position: relative;
    display: block;
    width: 100%;
    padding: 15px;
    background: ${(props) => props.theme.colors.overlay};
    border: 1px solid ${(props) => props.theme.colors.cover8};
    border-radius: 16px;
  }

  .KuxDivider-horizontal {
    margin: 20px 0;
  }

  .mark {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    height: 28px;
    padding: 0 12px;
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    border-radius: 0px 15px;
    &.notStart {
      color: ${(props) => props.theme.colors.complementary};
      background: ${(props) => props.theme.colors.complementary8};
    }

    &.inProcess {
      color: ${(props) => props.theme.colors.textPrimary};
      background: ${(props) => props.theme.colors.primary8};
    }

    &.completed {
      color: ${(props) => props.theme.colors.text60};
      background: ${(props) => props.theme.colors.cover4};
    }
  }
`;

export const PoolCommonInfoWrapper = styled.div``;
export const PoolSelfInfoWrapper = styled.div`
  display: flex;
  align-items: stretch;

  gap: 40px;
  .poolItemWrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    width: 50%;

    button {
      padding: 0 16px;
    }

    .symbolWrapper {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        object-fit: cover;
        border-radius: 24px;
      }
    }

    .dataWrapper {
      display: flex;
      flex-direction: row;
      align-items: center;

      .KuxDivider-vertical {
        height: 48px;
        margin: 0 16px;
      }

      .item {
        .label {
          margin-bottom: 4px;
          color: ${(props) => props.theme.colors.text60};
          font-weight: 400;
          font-size: 13px;
          font-style: normal;
          line-height: 130%;
        }
        .underlineLabel {
          text-decoration: underline;
          cursor: pointer;
          text-decoration-style: dashed;
          text-decoration-color: ${(props) => props.theme.colors.text20};
          text-underline-offset: 2px;
        }
        .value {
          display: flex;
          align-items: center;
          color: ${(props) => props.theme.colors.text};
          font-weight: 700;
          font-size: 18px;
          font-style: normal;
          line-height: 130%;

          &.primary {
            color: ${(props) => props.theme.colors.textPrimary};
          }
        }
      }
    }

    .top {
      margin-bottom: 24px;
    }

    .buttonWrapper {
      .assetsWrapper {
        display: inline-flex;
      }
      .btn {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 12px;
        button {
          flex: 1;
          width: 50%;
        }
      }
    }
    .descWrapper {
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      a {
        white-space: nowrap;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .poolItemWrapper {
      .symbolWrapper {
        font-size: 16px;
      }
      .dataWrapper {
        .KuxDivider-vertical {
          margin: 0 24px;
        }
        .item {
          .value {
            font-size: 24px;
          }
        }
      }
      .buttonWrapper {
        .assetsWrapper {
          .operatorWrapper {
            margin-left: 12px;
          }
        }
        .btn {
          display: block;
          button {
            width: auto;
            min-width: 120px;
            &:first-of-type {
              width: 240px;
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
`;

export const CurrencyInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 20px;
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    object-fit: cover;
    border-radius: 24px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .kcsWrapper {
      width: 100%;
      margin-top: 24px;
    }
    margin-bottom: 24px;
    img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .kcsWrapper {
      width: auto;
      margin-top: 0;
      margin-left: 12px;
    }
    margin-bottom: 40px;
    font-size: 20px;
    img {
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }
  }
`;

export const ProjectDataWrapper = styled.div`
  gap: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item {
    width: calc(33% - 16px);
    .label {
      margin-bottom: 4px;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
    .value {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .unit {
        margin-left: 4px;
      }

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        object-fit: cover;
        border-radius: 16px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    .item {
      width: 262px;
    }
  }
`;
export const H5ProjectDataWrapper = styled.div`
  div.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0;
    }

    .label {
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
    .value {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      .unit {
        margin-left: 4px;
      }
    }
  }
`;

export const MoreWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .textWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
      margin-left: 2px;
      transform: rotate(0deg);
      [dir='rtl'] & {
        transform: rotate(180deg);
      }
    }
  }
`;
export const H5StakedWarpper = styled.div`
  .kcsWrapper {
    margin: 20px 0;
  }
  .dataWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      margin-right: 16px;
      .item {
        .label {
          margin-bottom: 6px;
          color: ${(props) => props.theme.colors.text40};
          font-weight: 400;
          font-size: 13px;
          font-style: normal;
          line-height: 130%;
        }

        .value {
          display: flex;
          align-items: center;
          color: ${(props) => props.theme.colors.text};
          font-weight: 700;
          font-size: 18px;
          font-style: normal;
          line-height: 130%;
        }
      }
      .assetsWrapper {
        margin-top: 20px;
      }
    }
    .right {
      button {
        line-height: 100%;
        text-align: right;
      }
      .primary {
        color: ${(props) => props.theme.colors.textPrimary};
      }
    }
  }
  .buttonWrapper {
    margin-top: 12px;
  }
  .descWrapper {
    margin-top: 12px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
`;
export const H5ClaimWarpper = styled.div`
  .dataWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      margin-right: 16px;
      .item {
        .label {
          margin-bottom: 6px;
          color: ${(props) => props.theme.colors.text40};
          font-weight: 400;
          font-size: 13px;
          font-style: normal;
          line-height: 130%;
        }

        .underlineLabel {
          text-decoration: underline;
          cursor: pointer;
          text-decoration-style: dashed;
          text-decoration-color: ${(props) => props.theme.colors.text20};
          text-underline-offset: 2px;
        }

        .value {
          display: flex;
          align-items: center;
          color: ${(props) => props.theme.colors.primary};
          font-weight: 700;
          font-size: 18px;
          font-style: normal;
          line-height: 130%;
        }
      }
      .inlineItem {
        display: flex;
        align-items: center;
        margin-top: 4px;
        .label {
          color: ${(props) => props.theme.colors.text40};
          font-weight: 400;
          font-size: 13px;
          font-style: normal;
          line-height: 130%;
        }

        .value {
          margin-left: 2px;
          color: ${(props) => props.theme.colors.text};
          font-weight: 400;
          font-size: 14px;
          font-style: normal;
          line-height: 130%;
        }
      }
      .endItem {
        .value {
          color: ${(props) => props.theme.colors.text};
        }
      }
      .assetsWrapper {
        margin-top: 6px;
      }
    }
    .right {
      button {
        padding: 0 12px;
        line-height: 100%;
      }
    }
  }

  .buttonWrapper {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 20px;
    button {
      flex: 1;
      width: 50%;
    }
  }

  .descWrapper {
    margin-top: 12px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;

    a {
      white-space: nowrap;
    }
  }
`;

export const KCSTipWrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  padding: 7px 11px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.primary12};
  background: ${(props) => props.theme.colors.primary4};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text};
  cursor: default;
  margin-bottom: 32px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 11px;
  }
  .tipBgIcon {
    position: absolute;
    width: 120px;
    height: 150%;
    z-index: 0;
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
      display: block;
      width: 75px;
      left: 158px;
    }
  }
  img.coinLogo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .desc {
    display: flex;
    align-items: flex-start;
    flex: 1;
    flex-direction: column;
    font-size: 12px;
    font-weight: 500;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 14px;
      flex-direction: row;
      align-items: center;
    }
    .tip {
      flex: 1;
      word-break: break-word;
    }
    .link {
      margin-left: 0;
      margin-top: 8px;
      font-weight: 500;
      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-left: 24px;
        margin-top: 0;
        font-weight: 400;
      }
      a {
        text-decoration-line: none;
        display: inline-flex;
        align-items: center;
      }
      .icon {
        margin-left: 4px;
        [dir=rtl] & {
          transform: scale(-1);
        }
      }
    }
  }
`;

export const PoolTag = styled.div`
  padding: 3px 8px;
  border-radius: 16px 0px;
  background: #d3f475;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: #1d1d1d; // 颜色写死
  position: absolute;
  left: 0;
  top: 0;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 3px 12px;
  }
`;

export const H5PoolTag = styled.div`
  padding: 4px 8px 20px;
  border-radius: 16px 16px 0px 0px;
  background: #d3f475;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: #1d1d1d; // 颜色写死
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
`;

export const PlaceHolderText = styled.div`
  color: ${(props) => props.theme.colors.text40};
`;
