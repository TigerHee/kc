/**
 * Owner: jessie@kupotech.com
 */
import { MDialog, styled } from '@kux/mui';
import { Link } from 'components/Router';

export const StyledProjectItem = styled(Link)`
  width: 100%;
  display: block;
  border-radius: 16px;
  padding: 23px 15px 15px;
  position: relative;
  -webkit-touch-callout: none;
  // overflow: hidden;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 80px;
    border-radius: 15px 15px 0 0;
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
    padding: 0px 12px;
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    border-radius: 0px 15px;
  }

  .tag {
    position: absolute;
    top: -.5px;
    right: -.5px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    padding: 4px 8px;
    font-weight: 500;
    font-size: 12px;
    border-radius: 0px 16px 0 16px;
    background: linear-gradient(90deg, #7FFCA7 0%, #AAFF8D 100%);
    color: #1d1d1d;
  }

  &.notStart {
    .bg {
      background: linear-gradient(
        180deg,
        ${(props) => props.theme.colors.complementary8} 0%,
        ${(props) => props.theme.colors.overlay} 100%
      );
    }

    .mark {
      color: ${(props) => props.theme.colors.complementary};
      background: ${(props) => props.theme.colors.complementary8};
    }

    border: 1px solid ${(props) => props.theme.colors.complementary12};
  }

  &.inProcess {
    .bg {
      background: linear-gradient(
        180deg,
        ${(props) => props.theme.colors.primary8} 0%,
        ${(props) => props.theme.colors.overlay} 100%
      );
    }

    .mark {
      color: ${(props) => props.theme.colors.textPrimary};
      background: ${(props) => props.theme.colors.primary8};
    }

    border: 1px solid ${(props) => props.theme.colors.primary12};
  }

  &.completed {
    .bg {
      background: linear-gradient(
        180deg,
        ${(props) => props.theme.colors.cover4} 0%,
        ${(props) => props.theme.colors.overlay} 100%
      );
    }

    .mark {
      color: ${(props) => props.theme.colors.text60};
      background: ${(props) => props.theme.colors.cover4};
    }

    border: 1px solid ${(props) => props.theme.colors.cover8};
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 24px 24px;
    .bg {
      height: 120px;
    }

    &.projectCard {
      border: 1px solid ${(props) => props.theme.colors.cover8};
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 32px 40px;
  }
`;

export const ProjectInfoWrapper = styled.div`
  position: relative;
`;

export const H5ProjectInfoWrapper = styled.div`
  position: relative;
  .currencyIntro {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      object-fit: cover;
      vertical-align: middle;
      border-radius: 24px;
    }

    .name {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 18px;
      font-style: normal;
      line-height: 130%;
      vertical-align: middle;
      span {
        margin-right: 6px;
      }
    }
  }
  .dataWrapper {
    margin-bottom: 16px;
    div.item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      &:last-of-type {
        margin-bottom: 0;
      }

      .label {
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        font-size: 13px;
        font-style: normal;
        line-height: 130%;
      }

      .value {
        display: inline-flex;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
        .completedValue {
          text-align: right;
          .divider {
            margin: 0 3px;
          }
        }
        .utc {
          margin-left: 3px;
        }
      }
    }
  }
`;

export const CurrencyInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 48px;
  }
  .currencyIntro {
    .nameWrapper {
      display: flex;
      align-items: baseline;
      margin-bottom: 6px;
      .name {
        display: flex;
        align-items: center;
        margin-right: 8px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 18px;
        font-style: normal;
        line-height: 130%;
        span {
          margin-right: 8px;
        }
      }
      .fullName {
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
      }
    }
    .desc {
      display: -webkit-box;
      overflow: hidden;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    img {
      width: 64px;
      height: 64px;
    }
    .currencyIntro {
      .nameWrapper {
        margin-bottom: 6px;
        .name {
          margin-right: 6px;
          font-size: 20px;
        }
        .fullName {
          font-size: 12px;
        }
      }
      .desc {
        font-size: 14px;
      }
    }
  }
`;
export const ProjectDataWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 16px 0;

  .item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    background: ${(props) => props.theme.colors.cover2};
    border-radius: 16px;
    .value {
      margin-bottom: 4px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;
      text-align: center;

      .completedValue {
        font-size: 12px;
        text-align: center;
        .divider {
          margin: 0 4px;
        }

        .utc {
          margin-left: 4px;
        }
      }
    }
    .label {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    gap: 24px;
    margin: 32px 0;
    .item {
      .value {
        font-weight: 600;
        font-size: 20px;
        .completedValue {
          font-size: 20px;
        }
      }
    }
  }
`;
export const PoolListWrapper = styled.div`
  position: relative;
`;

export const TwoColoumnWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  // align-items: center;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;

  ${(props) => props.theme.breakpoints.up('lg')} {
    gap: 40px;
  }

  > div {
    width: calc(50% - 8px);
    ${(props) => props.theme.breakpoints.up('lg')} {
      width: calc(50% - 20px);
    }
  }
`;
export const ThreeColoumnWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  align-items: stretch;
  gap: 16px;
  > div {
    width: calc(33.3% - 11px);
    max-width: 362px;
    // &:nth-of-type(3n) {
    //   margin-right: 0;
    // }
  }
`;
export const ColoumnWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  > div {
    width: 100%;
  }
`;
export const StyledPoolCard = styled.div`
  width: 100%;
  border-radius: 16px;
  padding: 24px 16px;
  background: ${(props) => props.theme.colors.cover2};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 16px 24px;
    cursor: pointer;
    &.mini {
      &.inProcess {
        > div {
          align-items: flex-start;
        }
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 32px;
    &:hover {
      z-index: 3;
      background: ${(props) => props.theme.colors.cover4};
      transform: scale(1.01);
      transition: all 100ms ease-in-out;
    }
    &.mini {
      padding: 32px 24px;
      // > div {
      //   align-items: flex-start;
      // }
    }
  }
`;
export const PoolInfoWrapper = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    .symbolDesc {
      margin-top: 10px;
      margin-bottom: 16px;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }

    .dataWrapper {
      display: flex;
      flex-direction: column;

      .markText {
        display: inline-flex;
        padding: 1px 4px;
        color: ${(props) => props.theme.colors.complementary};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        background: ${(props) => props.theme.colors.complementary8};
        border-radius: 80px;
      }

      > div {
        display: flex;
        align-items: center;
      }
      &.miniDataWrapper {
        flex-direction: column;
        align-items: start;

        .coutdown {
          margin-top: 8px;
        }
        .markText {
          margin-top: 8px;
        }
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 40px;
    .inProcess & {
      margin-bottom: 32px;
    }
    .completed & {
      margin-bottom: 24px;
    }
    .left {
      .dataWrapper {
        flex-direction: row;
        align-items: center;
        .KuxDivider-root {
          height: 12px;
        }
      }
    }
  }
`;
export const PoolDataWrapper = styled.div`
  div.itemWrapper {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
    &.column {
      flex-direction: column;
      gap: 10px;
      div.item {
        width: 100%;
        display: flex;
        align-items: center;
        text-align: start;
        &:last-of-type {
          text-align: start;
        }
        .label {
          margin-bottom: 0;
        }
        .value {
          margin-inline-start: auto;
          .inProcess & {
            ${(props) => props.theme.breakpoints.up('sm')} {
              font-size: 14px;
            }
          }
        }
      }
    }
    div.item {
      width: 50%;
      .label {
        margin-bottom: 4px;
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        ${(props) => props.theme.breakpoints.up('lg')} {
          font-size: 13px;
        }
      }
      .value {
        display: flex;
        align-items: center;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 16px;
        font-style: normal;
        line-height: 130%;
        &.fixCount {
          flex-wrap: wrap;
          ${(props) => props.theme.breakpoints.up('sm')} {
            max-width: 180px;
          }
          ${(props) => props.theme.breakpoints.up('lg')} {
            max-width: initial;
          }
        }
      }
      &:last-of-type {
        text-align: right;
        .value {
          justify-content: flex-end;
        }
      }
    }
  }
  .divider {
    margin-top: 16px;
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.colors.divider8};
  }
`;
export const PoolButtonWrapper = styled.div`
  margin-top: 16px;
  .assets {
    margin: 12px 0 12px;
  }
`;

export const StyledH5PoolCard = styled.div`
  width: 100%;
  position: relative;

  &.withTag {
    padding-top: 22px;
  }

  .container {
    position: relative;
    z-index: 1;
    padding: 24px 16px;

    background: ${(props) => props.theme.colors.overlay};
    border-radius: 16px;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background: ${(props) => props.theme.colors.cover2};
      border-radius: 16px;
      content: '';
    }
  }
`;

export const H5PoolHeaderWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const H5PoolInfoWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    .dataWrapper {
      display: flex;
      align-items: center;
      margin-top: 16px;
      > div {
        margin-right: 8px;
      }

      .markText {
        display: inline-flex;
        padding: 1px 4px;
        color: ${(props) => props.theme.colors.complementary};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        background: ${(props) => props.theme.colors.complementary8};
        border-radius: 80px;
      }

      .num {
        font-weight: 500;
        font-size: 12px;
      }
      .time {
        font-weight: 500;
        font-size: 12px;
      }
    }
  }
  .right {
    margin-top: -16px;
  }
`;
export const H5PoolDataWrapper = styled.div`
  div.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    &:last-of-type {
      margin-bottom: 0;
    }

    .label {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
    .value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-left: 16px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      white-space: nowrap;
    }
  }
`;

export const SymbolWarpper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    object-fit: cover;
    vertical-align: middle;
    border-radius: 24px;
  }

  > span {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 18px;
    font-style: normal;
    line-height: 130%;
    vertical-align: middle;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }

    > span {
      font-size: 20px;
    }
  }
`;

export const UserNumberWarpper = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    color: ${(props) => props.theme.colors.icon60};
  }

  .num {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 600;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .num {
      font-weight: 400;
    }
  }
`;

export const SymbolGroupWarpper = styled.div`
  @keyframes circle {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 1px solid ${(props) => props.theme.colors.cover8};
  border-radius: 64px;

  img {
    width: 28px;
    height: 28px;
    object-fit: cover;
    background: ${(props) => props.theme.colors.overlay};
    border: 2px solid ${(props) => props.theme.colors.overlay};
    border-radius: 28px;

    &.outer {
      margin-left: -10px;
    }
  }

  .logoGroup {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    opacity: 0.4;
  }

  &.activeSymbolGroup {
    .logoGroup {
      opacity: 1;
    }
  }

  .circle {
    position: absolute;
    z-index: 1;
    animation: 2500ms linear circle infinite;
  }

  .value {
    position: absolute;
    right: -8px;
    bottom: -8px;
    z-index: 2;
    padding: 3px 5px;
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    white-space: nowrap;
    text-align: center;
    background: ${(props) => props.theme.colors.overlay60};
    border: 1px solid ${(props) => props.theme.colors.cover12};
    border-radius: 80px;
    backdrop-filter: blur(1px);
    .unit {
      margin-left: 1px;
      font-size: 12px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 80px;
    height: 80px;

    .circle {
      width: 94px;
      height: 94px;
    }

    &.activeSymbolGroup {
      border: 3px solid ${(props) => props.theme.colors.cover8};
    }

    img {
      width: 36px;
      height: 36px;
      border: 2px solid ${(props) => props.theme.colors.overlay};
      border-radius: 36px;
    }

    .value {
      right: 50%;
      transform: translateX(50%);
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 120px;
    height: 120px;

    .circle {
      width: 134px;
      height: 134px;
    }
    img {
      width: 40px;
      height: 40px;
      border: 2px solid ${(props) => props.theme.colors.overlay};
      border-radius: 40px;
    }

    .value {
      padding: 4px 5px;
      font-size: 14px;
    }
  }
`;

export const PlaceholderWrapper = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

export const H5PoolButtonWrapper = styled.div`
  margin-top: 16px;
`;

export const CountDownWarpper = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    color: ${(props) => props.theme.colors.icon60};
  }

  &.newCountdown {
    .time {
      color: ${(props) => props.theme.colors.text};
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
    }
  }
  .time {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 600;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-color: ${(props) => props.theme.colors.text20};
    text-underline-offset: 2px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .time {
      font-weight: 400;
    }
  }
  .timeTag {
    display: inline-flex;
    align-items: center;
  }
  .unit {
    padding: 2px 2px;
    border-radius: 2px;
    background: ${(props) => props.theme.colors.cover4};
    backdrop-filter: blur(2px);
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
  }
  .dot {
    font-size: 12px;
    color: ${(props) => props.theme.colors.icon};
    font-weight: 500;
    margin: 0 4px;
  }
`;
export const CountDownFullWarpper = styled.div`
  > span {
    display: flex;
    align-items: center;
    span.unit {
      margin-right: 4px;
      padding: none;
      color: ${(props) => props.theme.colors.text40};
      background: none;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
  }
`;

export const CountDownTagWarpper = styled.div`
  .unit {
    display: inline-block;
    min-width: 14px;
    padding: 2px 1px;
    color: ${(props) => {
      return props.theme.currentTheme === 'light' ? '#1d1d1d' : '#D3F475';
    }};
    font-weight: 500;
    font-size: 10px;
    line-height: 9px;
    text-align: center;
    background: ${(props) => {
      return props.theme.currentTheme === 'light' ? '#fff' : props.theme.colors.overlay;
    }};
    border-radius: 2px;
    &:first-of-type {
      margin-left: 2px;
    }
    &:last-of-type {
      margin-right: 2px;
    }
  }
  .dot {
    margin: 0 2px;
    color: rgba(29, 29, 29, 0.60);
    font-weight: 500;
    font-size: 12px;
  }
`;

export const PoolAvailableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.mini {
    justify-content: flex-start;
  }

  .leftWrapper {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;

    .KuxDropDown-popper {
      z-index: 10 !important;
    }
    .label {
      margin-right: 2px;
      color: ${(props) => props.theme.colors.text40};
    }
    .value {
      margin-right: 2px;
      color: ${(props) => props.theme.colors.text};
    }
  }

  .operatorWrapper {
    display: flex;
    align-items: center;

    .icon {
      position: relative;
      width: 16px;
      height: 16px;
      color: ${(props) => props.theme.colors.textPrimary};
      text-align: center;
      cursor: pointer;
      svg {
        width: 16px;
        height: 16px;
        vertical-align: super;
      }
    }

    .dropdownIcon {
      &:after {
        position: absolute;
        top: 0;
        left: -10px;
        width: 32px;
        height: 32px;
        content: '';
      }
    }

    .assetsBtn {
      color: ${(props) => props.theme.colors.textPrimary};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      cursor: pointer;
    }
  }

  // ${(props) => props.theme.breakpoints.up('lg')} {
  //   .operatorWrapper {
  //     margin-left: 12px;
  //   }
  // }
`;

export const RateWarpper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 80px;
  padding: 0px 4px;
  background: ${(props) => props.theme.colors.primary};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-left: 6px;
  color: ${(props) => props.theme.colors.textEmphasis};
  opacity: 0.4;
  &.activeRate {
    opacity: 1;
  }

  svg {
    width: 12px;
    height: 12px;
    margin-right: 3px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 2px 8px;
  }
`;

export const TaskEntranceWrapper = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  padding: 7px 11px;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.primary12};
  background: ${(props) => props.theme.colors.primary4};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  img {
    width: 20px;
    height: 20px;
  }
  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.colors.primary};
    transform: rotate(0deg);
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
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
  .desc {
    flex: 1;
    padding: 0;
    font-size: 12px;
    font-weight: 500;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 14px;
      padding: 0 12px 0 8px;
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 7px 23px;
    font-size: 14px;

    img {
      width: 32px;
      height: 32px;
    }
  }
  .wrapper {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-left: 10px;
    flex: 1;
    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: row;
      align-items: center;
      margin-left: 0;
    }
  }
  .highlight {
    color: ${props => props.theme.colors.primary};
    font-weight: 700;
  }
  .btnGroup {
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.primary};
    margin-top: 2px;
    font-size: 12px;
    font-weight: 500;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 14px;
      font-weight: 400;
      margin-top: 0;
    }
    svg {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 400;
    }
  }
`;

export const KCSTipWrapper = styled.div`
  display: flex;
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
  img.coinLogo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .desc {
    flex: 1;

    a {
      margin-left: 4px;
      text-decoration-line: underline;
      text-underline-offset: 2px;
    }
  }
`;

export const AlertWrapper = styled.div`
  margin-bottom: 16px;
`;

export const StyledDropDownOption = styled.div`
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  min-width: 186px;
  max-width: 240px;
  background-color: ${(props) => props.theme.colors.layer};
  button.create-option {
    ${(props) => props.theme.fonts.size.lg}
    padding: 0 16px;
    width: 100%;
    height: 48px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      height: 56px;
    }
  }
`;

export const FilterDialog = styled(MDialog)`
  .KuxModalFooter-root {
    padding: 12px 16px 46px;
  }
`;

export const StyledDropDownH5Option = styled.div`
  background-color: ${(props) => props.theme.colors.layer};
  border-radius: 16px 16px 0px 0px;
  padding-top: 12px;
  button.create-option {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
  }
`;

export const StyledDropDownOptionApp = styled.div`
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  width: calc(100vw - 29px);
  margin-left: 15px;
  background-color: ${(props) => props.theme.colors.layer};
  button.create-option {
    ${(props) => props.theme.fonts.size.lg}
    padding: 0 16px;
    width: 100%;
    height: 56px;
    color: ${(props) => props.theme.colors.text};
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
    /* &:nth-of-type(2n) {
      width: 100%;
      
    } */
  }
`;

export const AssetBtnWrapper = styled.span`
  cursor: pointer;
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
  padding: 4px 8px 18px;
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

export const AnnouncementWrapper = styled.div`
  padding: 2px 4px;
  border-radius: 4px;
  background: ${(props) => props.theme.colors.primary8};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;

  svg {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
`;

export const AprWrapper = styled.div`
  line-height: 1.3;
  &.inline {
    display: flex;
    align-items: center;
  }
  .label {
    display: inline-block;
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-color: ${(props) => props.theme.colors.text20};
    text-underline-offset: 2px;
    cursor: help;
  }
  .value {
    margin-block-start: auto;
  }
`;

export const ContentWrapper = styled.div`
  font-weight: 400;
`;

export const ButtonWrapper = styled.div`
  padding: 32px 0;
`;