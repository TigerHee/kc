/**
 * Owner: jessie@kupotech.com
 */
import { Carousel, styled } from '@kux/mui';
import { Link } from 'components/Router';

export const StyledProject = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  margin-top: 24px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  margin-bottom: 40px;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 120px;
    background: linear-gradient(180deg, rgba(211, 244, 117, 0.08) 0%, rgba(211, 244, 117, 0) 100%);
    border-radius: 19px;
  }

  .content {
    position: relative;
    z-index: 3;
    padding: 24px 16px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 40px;
    margin-bottom: 80px;
    border: none;
    border-radius: 0;
    .content {
      padding: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 1200px;
    margin-top: 48px;
    margin-bottom: 120px;
  }

  .header {
    .main-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 20px;
      line-height: 130%;

      .title-wrapper {
        display: flex;
        align-items: center;
      }

      .right-wrapper {
        display: flex;
        align-items: center;
        margin-left: 8px;
        .KuxDivider-vertical {
          margin: 0 8px;
        }
      }

      .project-icon {
        width: 38px;
        height: 38px;
        margin-right: 8px;
      }
    }

    .sub-title {
      margin-top: 12px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      .main-title {
        font-size: 28px;

        .project-icon {
          width: 48px;
          height: 48px;
          margin-right: 24px;
        }
      }

      .sub-title {
        font-size: 16px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      .main-title {
        font-weight: 600;
        font-size: 36px;
      }
    }
  }
`;

export const StyledActivity = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  margin-top: 24px;
  position: relative;

  .content {
    position: relative;
    z-index: 1;
    padding: 16px 0 0;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    border: 1px solid ${(props) => props.theme.colors.divider8};
    border-radius: 16px;

    .content {
      padding: 24px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px 20px 20px;
    }
  }
`;

export const StyledRightWrapper = styled.div`
  flex: 1;

  .bottom-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
    .bottom-wrapper {
      flex-direction: row;
      justify-content: space-between;
      margin: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 0;
    .bottom-wrapper {
      margin-top: 16px;
    }
  }
`;

export const StyledStartTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 12px;
  line-height: 130%;

  .start-label {
    margin-right: 4px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    white-space: nowrap;
  }

  .time-value {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    justify-content: flex-start;
    margin-top: 6px;
    font-size: 14px;
    .start-label {
      // margin-right: 12px;
      font-weight: 500;
    }

    .time-value {
      font-weight: 600;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 16px;
  }
`;

export const StyledTimer = styled.div`
  display: flex;
  justify-content: space-between;

  div.item {
    display: flex;
    align-items: center;
    &:not(:last-of-type) {
      margin-right: 4px;
    }

    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      margin-right: 4px;
      padding: 2px 1px;
      color: ${(props) => props.theme.colors.text};
      color: #1d1d1d;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
      background: #d3f475;
      border-radius: 2px;
    }

    .unit {
      color: ${(props) => props.theme.colors.text30};
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
    }
  }
`;

export const StyledButtonGroup = styled.div`
  width: 100%;

  .timeCount {
    float: left;
    height: 48px;
    margin-bottom: -24px;
    padding: 4px 8px;
    background: #d3f475;
    border-radius: 12px 12px 0px 0px;
  }

  .subscribe-btn {
    padding: 0 8px;
  }

  .KuxButton-outlined {
    background: ${(props) => props.theme.colors.overlay} !important;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    width: auto;
    .subscribe-btn {
      min-width: 120px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .subscribe-btn {
      min-width: 120px;
    }
  }
`;

export const StyledDetailInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 12px;

  div.item {
    display: flex;
    flex-direction: column;

    align-items: flex-start;
    width: calc(50% - 8px);

    &:nth-of-type(2n) {
      align-items: flex-end;
    }

    .value {
      margin-bottom: 2px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 16px;
      line-height: 130%;
    }

    .label {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      line-height: 130%;

      &.underline-label {
        display: inline-block;
        text-decoration: underline;
        cursor: help;
        text-decoration-style: dashed;
        text-underline-offset: 2px;
        text-decoration-color: ${(props) => props.theme.colors.text20};
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-wrap: nowrap;
    gap: 0;
    margin-top: 24px;

    div.item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: auto;

      &:nth-of-type(2n) {
        align-items: flex-start;
      }

      &:last-of-type {
        align-items: flex-end;
      }

      .value {
        font-size: 20px;
      }

      .label {
        font-size: 14px;
      }
    }
  }
`;

export const StyledEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 230px;
  padding-top: 64px;
  // margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    // margin-bottom: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    // margin-bottom: 32px;
  }
`;

export const CountDownEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 0;

  img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .text {
    color: ${(props) => props.theme.colors.complementary};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    justify-content: flex-start;
    width: 208px;
    margin: 0 24px;

    .text {
      flex: 1;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 296px;
  }
`;

export const LinkWrapper = styled(Link)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
  line-height: 1;
  cursor: pointer;

  svg {
    width: 16px;
    min-width: 16px;
    height: 16px;
    margin-right: 4px;
    color: ${(props) => props.theme.colors.icon};
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-right: 16px;
    padding: 11px 16px;
    color: ${(props) => props.theme.colors.text};
    font-size: 14px;
    line-height: 18px;
    background: ${(props) => props.theme.colors.cover4};
    border-radius: 80px;
    svg {
      margin-right: 8px;
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

export const ShareWrapper = styled.div`
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;

  svg {
    width: 16px;
    min-width: 16px;
    height: 16px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.cover4};
    border-radius: 40px;
  }
`;

export const HeaderWrapper = styled.div`
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
      margin-right: 0;
      img {
        width: 56px;
        height: 56px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .headerCountdown {
      display: flex;
      flex: 1;
      justify-content: flex-end;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    justify-content: center;
    width: 120px;
    height: 120px;
    margin-right: 32px;
    background: ${(props) => props.theme.colors.cover2};
    border-radius: 16px;
  }
`;

export const EndActivityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin: 20px 16px;
  color: ${(props) => props.theme.colors.text60};

  img {
    width: 56px;
    height: 56px;
    margin-bottom: 6px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    max-width: 300px;
    margin: 0 16px;
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    img {
      margin-right: 6px;
      margin-bottom: 0px;
    }
  }
`;

export const ActivityTimeWrapper = styled.div`
  margin: 0 16px;
  min-width: 200px;
  display: flex;
  align-items: center;

  .label {
    margin-right: 6px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 13px;
    font-style: normal;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 0 0 0 16px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: column;
    align-items: flex-start;
    margin: 0 16px;
    .label {
      margin-bottom: 6px;
    }
  }
`;

export const EmptyWrapper = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  padding: 16px 16px 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  justify-content: center;
  color: ${(props) => props.theme.colors.text40};

  img {
    width: 40px;
    height: 40px;
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 24px 0;
    font-size: 20px;
    img {
      width: 64px;
      height: 64px;
      margin-right: 12px;
    }
  }
`;

export const CurrencyInfoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  .nameWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 8px;

    .name {
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 18px;
      font-style: normal;
      line-height: 130%;
    }

    .fullName {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
  }

  .tag {
    display: flex;
    align-items: center;
    margin-top: 4px;

    .hot {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .label {
      padding: 2px 4px;
      color: ${(props) => props.theme.colors.primary};
      font-weight: 500;
      font-size: 12px;
      line-height: 130%;
      background: ${(props) => props.theme.colors.primary8};
      border-radius: 4px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    align-items: center;
    .nameWrapper {
      .name {
        font-weight: 700;
        font-size: 24px;
      }

      .fullName {
        font-size: 14px;
      }
    }

    .tag {
      margin-top: 0;

      .hot {
        width: 24px;
        height: 24px;
      }

      .label {
        font-size: 14px;
      }
    }
  }
`;

export const DataInfoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex: 1;
  width: 100%;
  margin: 16px 0;

  div.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    align-items: flex-start;
    margin: 0;

    div.item {
      display: block;
      flex: 1;
      width: 33%;
      margin-right: 16px;
      margin-bottom: 0;

      .label {
        margin-bottom: 6px;
      }
      .value {
        font-size: 16px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    div.item {
      max-width: 200px;
      .value {
        font-size: 18px;
      }
    }
  }
`;

export const MarkWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  // min-width: 80px;
  height: 24px;
  padding: 0px 10px 0 12px;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 130%;
  border-radius: 0px 0px 0px 16px;

  &.complementary {
    color: ${(props) => props.theme.colors.complementary};
    background: ${(props) => props.theme.colors.complementary12};
  }

  &.primary {
    color: ${(props) => props.theme.colors.textPrimary};
    background: ${(props) => props.theme.colors.primary12};
  }

  &.grey {
    color: ${(props) => props.theme.colors.text60};
    background: ${(props) => props.theme.colors.cover4};
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    height: 26px;
    padding: 0 12px;
    font-size: 14px;
    border-radius: 0px 15px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    height: 30px;
  }
`;

export const CountdownWrapper = styled.div`
  color: #1d1d1d;
  font-weight: 400;
  font-size: 12px;
  font-size: 11px;
  font-style: normal;
  line-height: 130%;
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
      display: inline-block;
      min-width: 15px;
      height: 15px;
      padding: 0 2px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      text-align: center;
      background: ${(props) => props.theme.colors.overlay};
      border-radius: 2px;
    }

    .split {
      display: inline-block;
      height: 15px;
      margin: 0 2px;
      color: ${(props) => props.theme.colors.icon};
      line-height: 15px;
    }
  }
`;

export const StyledCarousel = styled(Carousel)`
  padding-bottom: 16px;
  position: relative;
  .kux-slick-track {
    transition: transform 0ms;
    will-change: transform, transition;

    .kux-slick-slide {
      direction: ltr;
    }
  }
  .kux-slick-arrow {
    display: none;
  }
  .kux-slick-dots {
    bottom: 0;
    display: flex !important;
    align-items: center;
    justify-content: center;

    .kux-slick-item {
      width: 4px;
      height: 4px;
      &.kux-slick-active {
        width: 16px;
      }
    }
  }

  .campaign-slide {
    display: flex;
    width: 100%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-bottom: 20px;
  }
`;
