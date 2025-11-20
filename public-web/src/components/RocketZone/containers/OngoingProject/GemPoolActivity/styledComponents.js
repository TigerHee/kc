/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledProjectItem = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  margin-top: 24px;
  position: relative;

  .content {
    position: relative;
    z-index: 3;
    padding: 22px 0 0;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    border: 1px solid ${(props) => props.theme.colors.divider8};
    border-radius: 16px;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 120px;
      border-radius: 15px 15px 0 0;
    }
    .content {
      padding: 32px 24px 24px;
    }

    &.complementary {
      .bg {
        background: linear-gradient(
          180deg,
          ${(props) => props.theme.colors.complementary8} 0%,
          ${(props) => props.theme.colors.overlay} 100%
        );
      }
    }

    &.primary {
      .bg {
        background: linear-gradient(
          180deg,
          ${(props) => props.theme.colors.primary8} 0%,
          ${(props) => props.theme.colors.overlay} 100%
        );
      }
    }

    &.grey {
      .bg {
        background: linear-gradient(
          180deg,
          ${(props) => props.theme.colors.cover4} 0%,
          ${(props) => props.theme.colors.overlay} 100%
        );
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .content {
      padding: 32px;
    }
  }
`;

export const ProjectInfoWrapper = styled.div`
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
  }
`;

export const CurrencyInfoWrapper = styled.div`
  display: flex;
  align-items: center;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    margin-right: 8px;
    background: ${(props) => props.theme.colors.overlay};
    border: 1px solid ${(props) => props.theme.colors.text};
    border-radius: 40px;

    img {
      width: 35px;
      height: 35px;
      object-fit: cover;
      border-radius: 35px;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      width: 56px;
      min-width: 56px;
      max-width: 56px;
      height: 56px;
      margin-right: 20px;
      img {
        width: 49px;
        height: 49px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      width: 64px;
      min-width: 64px;
      max-width: 64px;
      height: 64px;
      img {
        width: 56px;
        height: 56px;
      }
    }
  }

  .currencyIntro {
    .nameWrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      .name {
        display: flex;
        align-items: center;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 18px;
        font-style: normal;
        line-height: 130%;
      }
      .KuxDivider-vertical {
        margin: 0;
      }
    }
    .media {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      .mediaItem {
        padding: 2px 7px;
        color: ${(props) => props.theme.colors.text60};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        border: 1px solid ${(props) => props.theme.colors.divider8};
        border-radius: 80px;
        cursor: pointer;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .currencyIntro {
      .nameWrapper {
        gap: 12px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .currencyIntro {
      .nameWrapper {
        .name {
          font-size: 20px;
        }
      }
    }
  }
`;
export const ProjectDataWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin: 16px 0;

  .label {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 13px;
    font-style: normal;
    line-height: 130%;
  }

  .value {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    display: inline-flex;
    height: 38px;
    margin: 0 0 0 16px;
    padding: 10px 16px;
    background: ${(props) => props.theme.colors.cover2};
    border-radius: 8px;
    .label {
      font-size: 14px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    height: 48px;
    padding: 8px 12px;

    .label {
      font-size: 15px;
    }
    .value {
      font-size: 18px;
    }
  }
`;
export const PoolListWrapper = styled.div`
  position: relative;
  margin: 16px 0 0;

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin: 24px 0 0;
  }
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
  flex-wrap: wrap;
  display: flex;
  align-items: stretch;
  gap: 16px;
  > div {
    width: calc(33.3% - 11px);
    max-width: 362px;
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
    cursor: pointer;
    &:hover {
      z-index: 3;
      background: ${(props) => props.theme.colors.cover4};
      transform: scale(1.02);
      transition: all 100ms ease-in-out;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 24px 32px;
  }
`;
export const EmptyActivityWrapper = styled.div`
  width: 100%;
  height: 228px;
  border-radius: 16px;
  padding: 24px 16px;
  background: ${(props) => props.theme.colors.cover2};
  position: relative;
  display: flex !important;
  align-items: center;
  justify-content: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;

    color: ${(props) => props.theme.colors.primary};
    font-weight: 400;
    font-size: 14px;
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

  ${(props) => props.theme.breakpoints.up('sm')} {
    height: auto;
  }
`;
export const PoolInfoWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    .dataWrapper {
      display: flex;
      flex-direction: row;
      margin-top: 16px;

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
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 32px;
    .left {
      .symbolDesc {
        margin-top: 10px;
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
      }
      .dataWrapper {
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
    .left {
      .symbolDesc {
        margin-top: 8px;
      }
      .dataWrapper {
        flex-direction: row;
        align-items: center;

        .coutdown {
          margin-top: 0;
        }
        .markText {
          margin-top: 0;
        }
      }
    }
  }
`;
export const PoolDataWrapper = styled.div`
  div.itemWrapper {
    div.item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      justify-content: space-between;

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
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
      }
      &:not(:first-of-type) {
        margin-top: 8px;
      }
    }
    &.column {
      flex-direction: column;
      gap: 10px;
      div.item {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: start;
        &:last-of-type {
          text-align: start;
        }
        .label {
          margin-bottom: 0;
        }
        .value {
          margin-block-start: auto;
        }
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    div.itemWrapper {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      justify-content: space-between;

      div.item {
        display: flex;
        flex-direction: column;
        gap: 0;
        align-items: flex-start;
        width: 50%;

        .label {
          margin-bottom: 4px;
          // font-size: 12px;
        }
        .value {
          font-size: 16px;
        }
        &:not(:first-of-type) {
          align-items: center;
          margin-top: 0;
          text-align: right;
        }
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
  }
`;
export const PoolButtonWrapper = styled.div`
  margin-top: 16px;
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
  margin-right: 8px;
  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    color: ${(props) => props.theme.colors.icon60};
  }

  .num {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-right: 0;
    .num {
      font-weight: 400;
      font-size: 14px;
    }
  }
`;

export const SymbolGroupWarpper = styled.div`
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

  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 80px;
    height: 80px;

    img {
      width: 36px;
      height: 36px;
      border: 2px solid ${(props) => props.theme.colors.overlay};
      border-radius: 36px;
    }
  }
`;

export const PlaceholderWrapper = styled.span`
  color: ${(props) => props.theme.colors.text40};
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

  .time {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-color: ${(props) => props.theme.colors.text20};
    text-underline-offset: 2px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 8px;
    .time {
      font-weight: 400;
      font-size: 14px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 0;
  }
`;

export const AlertWrapper = styled.div`
  margin: 16px 0 0;

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin: 24px 0 0;
  }
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
  cursor: pointer;
  margin-left: 6px;

  svg {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-left: 8px;
  }
`;

export const CountdownWrapper = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .timeCounter {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;

    [dir='rtl'] & {
      direction: rtl; // 日期专属
    }

    .item {
      display: inline-flex;
      align-items: center;
      min-width: 16px;
      height: 16px;
      padding: 0 2px;
      color: #1d1d1d;
      font-weight: 500;
      font-size: 12px;
      font-size: 11px;
      text-align: center;
      background: #d3f475;
      border-radius: 2px;
    }

    .split {
      display: inline-block;
      height: 16px;
      margin: 0 4px;
      color: ${(props) => props.theme.colors.icon60};
      line-height: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 13px;

    .timeCounter {
      margin-left: 10px;

      .item {
        min-width: 24px;
        height: 24px;
        font-size: 16px;
      }

      .split {
        display: inline-block;
        height: 24px;
        line-height: 24px;
      }
    }
  }
`;

export const MoreWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 400;
    font-size: 14px;
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

// export const StyledCarousel = styled(Carousel)`
//   .kux-slick-track {
//     transition: transform 0ms;
//     will-change: transform, transition;

//     .kux-slick-slide {
//       direction: ltr;
//     }
//   }
//   .kux-slick-arrow {
//     display: none;
//   }
//   .kux-slick-dots {
//     bottom: -16px;
//     display: flex !important;
//     align-items: center;
//     justify-content: center;
//     ${(props) => props.theme.breakpoints.up('sm')} {
//       bottom: -20px;
//     }

//     .kux-slick-item {
//       width: 4px;
//       height: 4px;
//       &.kux-slick-active {
//         ${(props) => props.theme.breakpoints.up('sm')} {
//           width: 16px;
//         }
//       }
//     }
//   }

//   .campaign-slide {
//     display: flex;
//     width: 100%;
//   }
// `;
