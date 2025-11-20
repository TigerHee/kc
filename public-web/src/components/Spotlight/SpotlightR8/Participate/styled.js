/**
 * Owner: saiya.lee@kupotech.com
 *
 * 活动参与(认购)
 */
import { styled } from '@kux/mui';
import participateTitleDarkIcon from 'static/spotlight8/participateIcon-dark.svg';
import participateTitleIcon from 'static/spotlight8/participateIcon.svg';
import particleBg from 'static/spotlight8/particle-bg.png';

export const Wrapper = styled.div`
  border-radius: 16px;
  margin: 24px 0 80px;
  overflow: hidden;
  padding: 2px 0;
  position: relative;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 24px 24px 80px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 24px 0 48px;
  }

  .participate-inner {
    position: relative;
    z-index: 1;
    padding: 32px 40px;
    background: ${(props) => (props.theme.currentTheme === 'dark' ? '#111917' : '#f5fcfa')}
      url(${particleBg}) no-repeat right top;
    background-size: 310px 162px;
    border: 1px solid #00c288;
    border-radius: 16px;

    ${(props) => props.theme.breakpoints.down('lg')} {
      padding: 24px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 20px 16px;
    }
  }

  &.is-ended {
    .participate-inner {
      border-color: ${(props) => props.theme.colors.cover12};
      background: ${(props) => (props.theme.currentTheme === 'dark' ? '#1B1B1B' : '#f6f6f6')};

      .left-wrapper {
        border-color: ${(props) => props.theme.colors.cover8};
        background: ${(props) => props.theme.colors.cover4};
      }
    }
    .border-gradient-bottom, .border-gradient-top {
      background: transparent;
      animation: none;
    }
  }

  .border-gradient-bottom {
    position: absolute;
    right: -250%;
    bottom: -26%;
    z-index: 0;
    width: 300%;
    height: 50%;
    background: radial-gradient(
      circle,
      ${(props) => (props.theme.currentTheme === 'dark' ? 'white' : '#D3F475')},
      transparent 10%
    );
    border-radius: 50%;
    opacity: 0.7;
    animation: star-movement-bottom linear infinite alternate;
    animation-duration: 6s;
  }

  .border-gradient-top {
    position: absolute;
    top: -26%;
    left: -250%;
    z-index: 0;
    width: 300%;
    height: 50%;
    background: radial-gradient(
      circle,
      ${(props) => (props.theme.currentTheme === 'dark' ? 'white' : '#D3F475')},
      transparent 10%
    );
    border-radius: 50%;
    opacity: 0.7;
    animation: star-movement-top linear infinite alternate;
    animation-duration: 6s;
  }

  @keyframes star-movement-bottom {
    0% {
      transform: translate(0%, 0%);
      opacity: 1;
    }
    100% {
      transform: translate(-100%, 0%);
      opacity: 0;
    }
  }

  @keyframes star-movement-top {
    0% {
      transform: translate(0%, 0%);
      opacity: 1;
    }
    100% {
      transform: translate(100%, 0%);
      opacity: 0;
    }
  }

  .title-item {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .title-countdown {
    display: none;
    gap: 4px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 13px;
    text-align: end;

    ${(props) => props.theme.breakpoints.down('lg')} {
      display: flex;
    }
  }

  .detail-countdown {
    display: flex;

    ${(props) => props.theme.breakpoints.down('lg')} {
      display: none;

      & + * {
        margin-top: 0 !important;
      }
    }
  }

  .participate-btn.KuxButton-containedPrimary {
    color: #fff;
  }
`;

export const ParticipateTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28px;
  font-weight: 600;
  gap: 8px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-size: 18px;
  }

  .participate-icon {
    width: 48px;
    height: 48px;
    background-image: url(${(props) =>
      props.theme.currentTheme === 'dark' ? participateTitleDarkIcon : participateTitleIcon});
    background-repeat: no-repeat;
    background-size: 100%;

    ${(props) => props.theme.breakpoints.down('sm')} {
      display: none;
    }

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

export const Content = styled.div`
  display: flex;
  gap: 64px;
  align-items: center;

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 24px;
  }
`;

export const LeftWrapper = styled.div`
  flex: 1;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 194, 136, 0.08);
  background: rgba(0, 194, 136, 0.04);

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 12px;

    .infoTitle, .infoContent {
      font-size: 14px;
    }
  }
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;

  & + & {
    margin-top: 16px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 10px;
    }
  }
  &.group-title + div {
    margin-top: 16px;
  }

  .infoTitle {
    display: flex;
    flex: 1;
    gap: 4px;
    align-items: center;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 16px;

    > svg {
      flex-shrink: 0;
    }
  }

  .infoContent {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    text-align: end;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;

    &.total-list {
      flex-direction: column;
      gap: 6px;
      align-items: end;
    }

  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .infoTitle {
      font-size: 13px;
    }
    .infoContent {
      font-size: 14px;
    }
  }
  &.distribution-end {
    .infoContent {
      color: ${(props) => props.theme.colors.text60};
    }
  }
`;

export const RightWrapper = styled.div`
  flex: 1;
`;

export const CountdownWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 4px;

  .item {
    display: block;
    width: 24px;
    height: 24px;
    padding: 2px 1px;
    color: #1d1d1d;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.3;
    text-align: center;
    background: #d3f475;
    border-radius: 2px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 18px;
      height: 18px;
      font-size: 12px;
    }
  }

  .split {
    display: inline-block;
    height: 15px;
    margin: 0 4px;
    color: ${(props) => props.theme.colors.icon};
    font-size: 14px;
    line-height: 1.3;

    ${(props) => props.theme.breakpoints.down('lg')} {
      position: relative;
      width: 2px;
      color: transparent;
      transform: translate(-1px, -2px);
      &:before {
        color: ${(props) => props.theme.colors.icon};
        line-height: 0;
        content: ':';
      }

      &:last-of-type {
        display: none;
      }
    }
  }
`;

export const SubscriptionOptionsWrapper = styled.div`
  display: flex;
  gap: 4px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 16px;
  }

  .subscription-option {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
    min-height: 64px;
    padding: 19px 12px;

    .subscription-bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background: ${(props) => props.theme.colors.cover4};
      clip-path: polygon(
        12px 0,
        100% 0,
        100% calc(100% - 12px),
        calc(100% - 12px) 100%,
        0 100%,
        0 12px
      );

      [dir='rtl'] & {
        clip-path: polygon(
          0 0,
          calc(100% - 12px) 0,
          100% 12px,
          100% 100%,
          12px 100%,
          0 calc(100% - 12px)
        );
      }
    }

    &:before {
      position: absolute;
      top: 0;
      right: -12px;
      width: 0;
      height: 0;
      border-color: ${(props) => props.theme.colors.cover4} transparent transparent
        ${(props) => props.theme.colors.cover4};
      border-style: solid;
      border-width: 6px;
      content: '';
    }
    &:after {
      position: absolute;
      bottom: 0;
      left: -12px;
      width: 0;
      height: 0;
      border-color: transparent ${(props) => props.theme.colors.cover4}
        ${(props) => props.theme.colors.cover4} transparent;
      border-style: solid;
      border-width: 6px;
      content: '';
    }

    &:first-of-type {
      .subscription-bg {
        border-radius: 8px 0 0 8px;
        clip-path: polygon(
          0 0,
          100% 0,
          100% calc(100% - 12px),
          calc(100% - 12px) 100%,
          0 100%,
          0 0
        );

        [dir='rtl'] & {
          clip-path: polygon(0 0, 100% 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
      }
      &:after {
        display: none;
      }
    }

    &:last-of-type {
      .subscription-bg {
        border-radius: 0 8px 8px 0;
        clip-path: polygon(12px 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 12px);

        [dir='rtl'] & {
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 100%);
        }
      }
      &:before {
        display: none;
      }
    }

    &:only-child {
      .subscription-bg {
        border-radius: 8px;
        clip-path: unset;
      }

      &:before,
      &:after {
        display: none;
      }
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      &:before,
      &:after {
        display: none;
      }

      .subscription-bg {
        border: 1px solid ${(props) => props.theme.colors.cover8};
        border-radius: 8px !important;
        clip-path: unset !important;
      }
    }

    .promotion-tip {
      position: absolute;
      top: -8px;
    }

    .option-icon {
      width: 40px;
      height: 40px;
      background: rgba(243, 243, 243, 0.08);
      border-radius: 100%;

      ${(props) => props.theme.breakpoints.down('sm')} {
        width: 32px;
        height: 32px;
      }
    }

    .option-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;

      .option-tags {
        display: none;
      }

      .price {
        display: none;

        margin-top: 4px;
        font-size: 13px;
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;

        ${(props) => props.theme.breakpoints.down('sm')} {
          display: block;
        }
      }

      &.is-recommended {
        .price {
          color: #00c288;
        }
      }

      ${(props) => props.theme.breakpoints.down('sm')} {
        color: ${(props) => props.theme.colors.text};
        font-weight: 500;
        .option-tags {
          margin-left: 4px;
          display: inline-block;
        }

        .option-tag {
          display: inline-block;
          padding: 2px 4px;
          color: #00c288;
          font-size: 12px;
          background: rgba(0, 194, 136, 0.08);
          border-radius: 4px;
        }
      }
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      flex-direction: row;
      gap: 8px;
      padding: 12px;

      .promotion-tip {
        top: -12px;
        left: 0;
        padding: 4px 8px;
        border-bottom-left-radius: 0;
        &::before {
          display: none;
        }
        &::after {
          position: absolute;
          top: 100%;
          left: 0;
          width: 18px;
          height: 18px;
          background: radial-gradient(
            circle at bottom right,
            transparent 0%,
            transparent 18px,
            #d3f475 18px
          );
          transform: translateY(-0.2px);
          content: '';

          [dir='rtl'] & {
            /* @noflip */
            background: radial-gradient(
              circle at bottom left,
              transparent 0%,
              transparent 18px,
              #d3f475 18px
            );
          }
        }
      }
    }
  }
`;

export const SubscriptionInfoWrap = styled.div`
  .infoTitle, .infoContent {
    font-size: 16px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 14px;
    }
  }
  .group-title {
    align-items: center;
    .infoTitle {
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 18px;
    }
    .infoContent {
      display: flex;
      gap: 4px;
      align-items: center;
      color: ${(props) => props.theme.colors.text60};
      font-size: 13px;
      font-weight: 400;
      cursor: pointer;
      justify-content: flex-end;
    }
  }

  .est-info {
    margin-top: 8px;
  }
`;

export const InFactWrapper = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  line-height: 1.5;

  .info-item + .info-item {
    border-top: 1px solid ${(props) => props.theme.colors.divider4};
  }

  .info-item {
    padding: 10px 0;
  }

  .info-highlight {
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => (props.theme.currentTheme === 'dark' ? '#fff' : '#1d1d1d')};

  }
  .highlight {
    color: ${(props) => props.theme.colors.primary};
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .info-item  {
      padding: 16px 0;
    }
  }

  .KuxTooltip-title & {
    color: rgba(243, 243, 243, 0.40);
    .info-item {
      border-top-color: rgba(243, 243, 243, 0.04);
    }
    .info-highlight {
      color: #fff;
    }
  }

  .info-item:last-of-type {
    padding-bottom: 0;
  }
  .info-item:first-of-type {
    padding-top: 0;
  }
`;
