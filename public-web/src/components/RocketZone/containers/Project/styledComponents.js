/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { Link } from 'components/Router';

export const StyledProject = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  margin-top: 24px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.divider8};

  &.newListing {
    margin-top: 0;
    margin-bottom: 54px;
  }

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
    padding: 16px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    &.newListing {
      margin-top: 0;
      margin-bottom: 72px;
    }
    .logoBg {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 2;
      width: 120px;
      height: 120px;
    }

    .content {
      padding: 24px;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 1200px;
    margin-top: 40px;

    &.newListing {
      margin-top: 16px;
      margin-bottom: 100px;
    }

    .logoBg {
      width: 160px;
      height: 160px;
    }

    .content {
      padding: 32px;
    }
  }

  .header {
    .main-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 18px;
      line-height: 130%;

      .title-wrapper {
        display: flex;
        align-items: center;
      }

      .project-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }

    .sub-title {
      margin-top: 12px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      line-height: 130%;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      .main-title {
        font-size: 24px;

        .project-icon {
          width: 40px;
          height: 40px;
          margin-right: 16px;
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

        .project-icon {
          width: 48px;
          height: 48px;
          margin-right: 24px;
        }
      }
    }
  }
`;

export const StyledActivity = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  border-radius: 16px;
  background: ${(props) => props.theme.colors.cover2};
  margin-top: 24px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    &:hover {
      background: ${(props) => props.theme.colors.cover4};
    }

    &:first-of-type {
      margin-top: 32px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 40px;
    padding: 40px 32px;
  }
`;

export const StyledRightWrapper = styled.div`
  .title-container {
    .miniTitle {
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
    }
    .title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .name {
        display: flex;
        align-items: center;
        margin-right: 8px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 700;
        font-size: 16px;
        line-height: 130%;
      }

      .fullName {
        color: ${(props) => props.theme.colors.text40};
        font-weight: 500;
        font-size: 12px;
        line-height: 130%;
      }
    }

    .tag {
      display: flex;
      align-items: center;
      .hot {
        margin-left: 4px;
      }

      .label {
        margin-left: 4px;
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
      display: flex;
      align-items: center;
      .miniTitle {
        font-size: 14px;
      }
      .title {
        .name {
          margin-right: 0;
          margin-bottom: 2px;
          font-size: 18px;
        }
      }

      .tag {
        .label {
          // max-width: 72px;
        }
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      margin-bottom: 12px;
      .miniTitle {
        font-size: 20px;
      }
      .title {
        .name {
          margin-bottom: 4px;
          font-size: 24px;
        }

        .fullName {
          font-weight: 400;
          font-size: 14px;
        }
      }

      .tag {
        .label {
          font-size: 14px;
        }
      }
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
  margin-top: 12px;
  div.item {
    display: flex;
    align-items: center;

    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 48px;
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 20px;
      line-height: 130%;
      background: linear-gradient(
        to bottom,
        ${(props) => props.theme.colors.cover4} 0px,
        ${(props) => props.theme.colors.cover4} 23px,
        ${(props) => props.theme.colors.cover8} 24px,
        ${(props) => props.theme.colors.overlay} 25px,
        ${(props) => props.theme.colors.overlay} 48px
      );
      border-radius: 4px;
      box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.12);
    }

    .unit {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: column;
      &:not(:last-of-type) {
        margin-right: 16px;
      }

      .time {
        margin-right: 0;
      }

      .unit {
        margin-top: 6px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      flex-direction: row;
      &:not(:last-of-type) {
        margin-right: 24px;
      }
      .time {
        margin-right: 6px;
        font-size: 24px;
      }

      .unit {
        margin-top: 0;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 0 24px;
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  align-items: center;
  .subscribe-btn {
    flex: 1;
    margin-right: 16px;
    padding: 0 8px;
  }

  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: ${(props) => props.theme.colors.cover4};
    border-radius: 40px;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
      color: ${(props) => props.theme.colors.text};
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .subscribe-btn {
      width: 112px;
      margin-right: 12px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .subscribe-btn {
      width: 160px;
      margin-right: 16px;
    }
  }
`;

export const StyledDetailInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;

  div.item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    margin-bottom: 12px;

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
    margin-top: 24px;
    div.item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: auto;
      margin-bottom: 0;

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
  line-height: 130%;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    color: ${(props) => props.theme.colors.icon};
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 14px;
    svg {
      margin-right: 8px;
    }
  }
`;

export const HeaderWrapper = styled.div`
  .header-wrapper {
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
      margin-right: 12px;
      border: 1px solid ${(props) => props.theme.colors.text};
      border-radius: 40px;

      img {
        width: 34px;
        height: 34px;
        object-fit: cover;
        border-radius: 34px;
      }

      ${(props) => props.theme.breakpoints.up('lg')} {
        width: 56px;
        min-width: 56px;
        max-width: 56px;
        height: 56px;
        margin-right: 24px;
        img {
          width: 48px;
          height: 48px;
        }
      }
    }
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
  margin: 20px 16px;
  .label {
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    text-align: center;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 0 16px;
    .label {
      margin-bottom: 6px;
      font-size: 14px;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    .label {
      margin-bottom: 12px;
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
