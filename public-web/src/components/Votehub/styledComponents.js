/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 11:27:58
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-15 16:47:14
 * @FilePath: /public-web/src/components/Votehub/styledComponents.js
 * @Description:
 */
/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import bg from 'static/votehub/banner_lg.png';
import bgDark from 'static/votehub/banner_lg_dark.png';

export const StyledPage = styled.main`
  position: relative;
  font-family: 'Roboto';
  background-color: ${(props) => props.theme.colors.overlay};

  ${(props) => props.theme.breakpoints.up('lg')} {
    min-width: 1200px;
    background: ${props => `url(${props.theme.currentTheme === 'dark' ? bgDark : bg}) no-repeat`};
    background-size: 100% auto;
  }

  button {
    cursor: pointer;
  }
`;

export const BaseContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: 24px;
    padding-left: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-right: 0;
    padding-left: 0;
  }
`;

export const BaseSection = styled.section`
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 60px;
  }
`;

export const StyledBg = styled.div`
  width: 100%;
  position: absolute;
  z-index: 1;
  left: 0;
  top: ${(props) => (props.isInApp ? '88px' : '0px')};
  img {
    width: 100%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    top: 0px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 120px;
      background: linear-gradient(transparent, ${(props) => props.theme.colors.overlay});
      content: ' ';
    }
  }
`;

export const StyledBanner = styled.section`
  padding-top: ${(props) => (props.isInApp ? '20px' : '64px')};
  padding-bottom: 40px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 60px;
    padding-bottom: 60px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 60px;
    padding-bottom: 80px;
  }
`;

export const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  article {
    margin-bottom: 40px;
    padding: 0 13px;
    text-align: center;
    h1 {
      margin: 0 0 10px 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 28px;
      font-style: normal;
      line-height: 130%;
    }

    p {
      margin: 0 0 24px 0;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }

    .btnGroup {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      button {
        min-width: 134px;
        padding: 0 8px;
        svg {
          margin-right: 6px;
          vertical-align: middle;

          [dir='rtl'] & {
            transform: rotateY(180deg);
          }
        }

        &:first-of-type {
          margin-right: 9px;
        }
      }
    }
  }

  .activeCard {
    width: 100%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    article {
      margin-bottom: 50px;
      padding: 0 36px;
      h1 {
        font-size: 48px;
      }

      p {
        margin: 0 0 40px 0;
        font-size: 16px;
      }

      .btnGroup {
        button {
          min-width: 155px;
          padding: 0px 24px;
          svg {
            margin-right: 4px;
          }

          &:first-of-type {
            margin-right: 16px;
          }
        }
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    justify-content: space-between;

    article {
      width: 690px;
      margin-bottom: 0;
      padding: 0;
      text-align: left;
      .btnGroup {
        justify-content: flex-start;
      }
    }

    .activeCard {
      width: 460px;
    }
  }
`;

export const ActivityCardContainer = styled.div`
  width: 100%;
  border-radius: 16px;
  // 黑色写死 #171717 白色写死#ffffff  非组件库对应值
  background-color: ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
  padding: 16px;
  border: ${(props) => `1px solid ${props.theme.colors.cover4}`};
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    border: none;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.04);
    // box-shadow:  ${(props) => props.theme.shadows.base};
  }

  .hr {
    margin: 12px 0;
    border-bottom: ${(props) => `1px dashed ${props.theme.colors.divider8}`};
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .hr {
      margin: 14px 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .hr {
      margin: 16px 0;
    }
  }
`;

export const ActivityCardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .title {
    overflow: hidden;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .time {
    flex: 1;
    margin-left: 16px;
    white-space: nowrap;
    text-align: right;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 32px;
    .title {
      font-size: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 32px;
  }
`;

export const CountdownWrapper = styled.div``;
export const CountdownInDay = styled.span`
  color: ${(props) => props.theme.colors.text40};
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
  line-height: 130%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 13px;
  }
  .timeCounter {
    display: inline-flex;
    align-items: center;
    .item {
      display: inline-block;
      min-width: 16px;
      height: 15px;
      padding: 0 2px;
      color: ${(props) => props.theme.colors.textEmphasis};
      font-weight: 400;
      font-size: 12px;
      font-size: 10px;
      font-style: normal;
      line-height: 15px;
      text-align: center;
      background: ${(props) => props.theme.colors.primary};
      border-radius: 2px;
    }

    .split {
      display: inline-block;
      height: 15px;
      margin: 0 4px;
      color: ${(props) => props.theme.colors.text60};
      line-height: 15px;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      .item {
        min-width: 20px;
        height: 18px;
        font-size: 12px;
        line-height: 18px;
      }

      .split {
        height: 18px;
        margin: 0 4px;
        line-height: 18px;
      }
    }
  }
`;

export const CountdownMoreDay = styled.span`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
  line-height: 130%;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 13px;
  }
  .value {
    // margin-right: 4px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;

    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 16px;
    }
  }
`;

export const ActivityCardStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .projectInfo {
    display: flex;
    flex: 1;
    align-items: center;
  }
  .status {
    margin-right: 12px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 18px;
    font-style: normal;
    line-height: 130%;
  }

  svg {
    width: 14px;
    height: 14px;
    margin-left: 12px;
    color: ${(props) => props.theme.colors.icon};
    cursor: pointer;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .status {
      font-size: 24px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    .status {
      font-size: 24px;
    }
  }
`;
export const ProjectListWrapper = styled.div`
  display: inline-flex;
  margin-left: 6px;

  .projectIcon {
    position: relative;
    width: 20px;
    height: 20px;
    margin-left: -6px;
    background: ${(props) => props.theme.colors.overlay};
    border: ${(props) => `2px solid ${props.theme.colors.overlay}`};
    border-radius: 20px;

    ${(props) => props.theme.breakpoints.up('sm')} {
      width: 28px;
      height: 28px;
    }
  }
`;

export const ProjectListWrapper2 = styled.div`
  @keyframes fadeOut {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    19% {
      opacity: 0;
    }
    20% {
      width: 6px;
      transform: scale(0);
      opacity: 0;
    }
    100% {
      width: 6px;
      height: 6px;
      transform: scale(0);
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    20% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  display: inline-flex;

  .carousel {
    display: flex;
    width: 48px;
    padding-left: 6px;
    overflow: hidden;

    .inner {
      display: block;
      display: flex;
      align-items: center;
      height: 20px;
      white-space: nowrap;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .carousel {
      width: 72px;

      .inner {
        height: 28px;
      }
    }
  }

  .projectIcon {
    position: relative;
    width: 20px;
    height: 20px;
    margin-left: -6px;
    background: ${(props) => props.theme.colors.overlay};
    border: ${(props) => `2px solid ${props.theme.colors.overlay}`};
    border-radius: 20px;
    transform: scale(0);

    &.fadeOut {
      animation: 2500ms ease-out fadeOut;
    }

    &.fadeIn {
      animation: 2500ms ease-out fadeIn;
    }

    &.active {
      width: 20px;
      height: 20px;
      transform: scale(1);
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      width: 28px;
      height: 28px;
      &.active {
        width: 28px;
        height: 28px;
      }
    }
  }
`;

export const ActivityCardInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ticketNumber {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    .value {
      margin-top: 4px;
      color: ${(props) => props.theme.colors.primary};
      font-weight: 700;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 14px;
      .value {
        margin-top: 6px;
        font-size: 20px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      font-size: 16px;
      .value {
        margin-top: 8px;
        font-size: 24px;
      }
    }
  }
  .ticketList {
    display: inline-flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    cursor: pointer;

    svg {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-weight: 700;
      font-size: 14px;
      svg {
        width: 18px;
        height: 18px;
        margin-left: 6px;
      }
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      font-size: 16px;
    }
  }
`;
export const ActivityCardButton = styled.div`
  margin-top: 16px;
  display: flex;
  button {
    flex: 1;
    padding: 0 12px;
    &:nth-of-type(2n) {
      margin-left: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
    padding: 0;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 24px;
  }
`;

export const StyledCurrentProject = styled(BaseSection)``;

export const CurrentProjectContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  div.projectItem {
    width: 100%;
    margin-bottom: 12px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    div.projectItem {
      width: calc(50% - 12px);
      margin-right: 24px;
      margin-bottom: 24px;

      &:nth-of-type(2n) {
        margin-right: 0;
      }
    }

    p.specialProjectItem {
      width: 100%;
      margin-right: 0;
      margin-bottom: 24px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    &.isMin {
      margin-bottom: -24px;
    }
    div.projectItem {
      width: 384px;
      margin-right: 24px;
      &:nth-of-type(2n) {
        margin-right: 24px;
      }
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
`;

export const StyledWinProject = styled(BaseSection)``;

export const WinProjectContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: -12px;
  div.projectItem {
    width: 100%;
    margin-right: 0;
    margin-bottom: 12px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: -24px;
    div.projectItem {
      margin-bottom: 24px;

      &.multiProjectItem {
        width: calc(50% - 12px);
        margin-right: 24px;
        &:nth-of-type(2n) {
          margin-right: 0;
        }
      }
    }
  }
`;

export const StyledProject = styled(BaseSection)``;

export const ProjectContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  div.projectItem {
    width: 100%;
    margin-bottom: 12px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    div.projectItem {
      width: calc(50% - 12px);
      margin-right: 24px;
      margin-bottom: 24px;

      &:nth-of-type(2n) {
        margin-right: 0;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    &.isMin {
      margin-bottom: -24px;
    }
    div.projectItem {
      width: 384px;
      margin-right: 24px;
      &:nth-of-type(2n) {
        margin-right: 24px;
      }
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
`;

export const StyledHistoryProject = styled(BaseSection)``;

export const HistoryProjectContainer = styled.div`
  div.projectItem {
    width: 100%;
    margin-bottom: 16px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    div.projectItem {
      width: 100%;
      margin-bottom: 24px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    &.isMin {
      margin-bottom: -24px;
    }
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    div.projectItem {
      width: 588px;
      margin-right: 24px;
      &:nth-of-type(2n) {
        margin-right: 0;
      }
    }
  }
`;

export const StyledTask = styled(BaseSection)``;

export const StyledFAQ = styled(BaseSection)``;

export const FAQContainer = styled.div`
  div.KuxAccordion-root {
    margin-bottom: 16px;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.cover2};
    border-radius: 16px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .KuxAccordion-head {
      padding: 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .KuxAccordion-iconWrapper {
        svg {
          width: 20px;
          height: 20px;
          margin-left: 8px;
          color: ${(props) => props.theme.colors.text};
          vertical-align: middle;
        }
      }
    }

    .KuxAccordion-panel {
      padding: 0;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 150%;

      .KuxDivider-root {
        margin: 16px 0;
        background: ${(props) => props.theme.colors.cover4};
      }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 24px;
      padding: 32px 40px;

      .KuxAccordion-head {
        font-size: 24px;

        .KuxAccordion-iconWrapper {
          svg {
            width: 32px;
            height: 32px;
            margin-left: 16px;
          }
        }
      }

      .KuxAccordion-panel {
        font-size: 18px;

        .KuxDivider-root {
          margin: 40px 0;
        }
      }
    }

    .KuxAccordion-activeBg {
      display: none;
    }
  }
`;

export const StyledRules = styled(BaseSection)``;

export const RulesContainer = styled.div`
  padding: 16px;
  background-color: ${(props) => props.theme.colors.cover2};
  border-radius: 16px;
  color: ${(props) => props.theme.colors.text40};
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 150%;

  p {
    &.title {
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
    }
    margin-bottom: 12px;
    &::last-of-type {
      margin-bottom: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 40px;
    font-size: 18px;
  }
`;

export const EmptyWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 260px;
  width: 100%;
`;

export const MoreArrow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    display: inline-flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 13px;
    font-style: normal;
    line-height: 14px;
    text-align: center;

    &:hover {
      color: ${(props) => props.theme.colors.text};
    }

    svg {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 16px;
      line-height: 18px;
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

export const ExtraWrapper = styled.span`
  width: 100%;
  display: inline-flex;
  align-items: center;
  // justify-content: center;

  > span {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    text-align: right;
    cursor: pointer;
  }

  svg {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    > span {
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
    }

    svg {
      width: 20px;
      height: 20px;
      margin-left: 8px;
    }
  }
`;

export const StyledHeader = styled.div`
  position: relative;
  height: 44px;
  padding-top: 44px;
  box-sizing: content-box;
  .app-custom-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 88px;
    padding-top: 44px;
    color: ${(props) => props.theme.colors.text};
    background-color: transparent;
    transition: background-color 200ms linear;
    &.fillHeader {
      background-color: ${(props) => props.theme.colors.overlay};
    }
    button {
      padding: 0;
      color: inherit;
      font: inherit;
      background: none;
      border: none;
      outline: inherit;
      cursor: pointer;
    }
    .back-arrow-icon {
      position: absolute;
      top: 52px;
      left: 16px;
      transform: rotate(180deg);
      [dir='rtl'] & {
        transform: rotate(0deg);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .title-text {
      h1 {
        margin: 0;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 18px;
        font-style: normal;
        line-height: 44px;
        text-align: center;
      }
    }
  }
`;

export const StyledFooter = styled.div`
  padding-bottom: ${(props) => (props.isInApp ? '20px' : 0)};
`;

export const ContentWrapper = styled.div`
  .entranceWrapper {
    position: relative;
    margin-bottom: 12px;
    padding: 20px 12px;
    overflow: hidden;
    background: ${(props) => props.theme.colors.primary8};
    border: 1px solid ${(props) => props.theme.colors.primary12};
    border-radius: 12px;
    cursor: pointer;

    .content {
      position: relative;
      z-index: 2;
      padding-right: 130px;
    }

    .welfareCoin {
      position: absolute;
      top: 57px;
      left: 0;
      height: 32px;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }

    .welfareGift {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 100%;
      max-height: 76px;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }

    h2 {
      margin: 0;
      color: ${(props) => props.theme.colors.primary};
      font-weight: 700;
      font-size: 14px;
      font-style: normal;
      line-height: 150%;

      .text {
        margin-right: 5px;
      }

      svg {
        width: 16px;
        height: 16px;
        vertical-align: text-bottom;
        [dir='rtl'] & {
          transform: rotateY(180deg);
        }
      }

      .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-bottom: 2px;
        vertical-align: middle;
        background: ${(props) => props.theme.colors.text};
        border-radius: 16px;
        svg {
          width: 12px;
          height: 12px;
          color: ${(props) => props.theme.colors.textEmphasis};
        }
      }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 24px;
      padding: 30px 25px;

      .content {
        padding-right: 40%;
      }

      h2 {
        font-size: 28px;
        line-height: 130%;
        .text {
          margin-right: 16px;
        }

        svg {
          width: 32px;
          height: 32px;
        }
      }

      p {
        font-weight: 500;
        font-size: 18px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      padding: 30px 42px;
      .content {
        padding-right: 16%;
      }

      .welfareGift {
        height: 100%;
      }
    }
  }

  .taskWrapper {
    padding: 0 16px;
    border: 1px solid ${(props) => props.theme.colors.divider8};
    border-radius: 12px;

    button.primary {
      background: ${(props) => props.theme.colors.primary};
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 0 32px;
    }
  }

  .KuxDivider-root {
    margin: 0;
  }

  &.modalWrapper {
    .entranceWrapper {
      .content {
        position: relative;
        z-index: 2;
        padding-right: 130px;
      }

      .welfareCoin {
        position: absolute;
        top: 57px;
        left: 0;
        height: 32px;
      }

      .welfareGift {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 100%;
      }

      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-bottom: 12px;
        padding: 16px 24px;

        .content {
          padding-right: 30%;
        }

        .welfareGift {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 100%;
        }

        h2 {
          // margin: 0 0 8px;
          font-size: 18px;

          svg {
            width: 20px;
            height: 20px;
          }
        }

        p {
          font-weight: 400;
          font-size: 14px;
        }
      }
    }

    .taskWrapper {
      padding: 0;
      border: none;

      ${(props) => props.theme.breakpoints.up('sm')} {
        padding: 0;
      }
    }
  }
`;

export const TaskButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 16px;
  button {
    max-width: 90px;
    margin-left: 0;
    line-height: 1;
    &:nth-of-type(2n) {
      margin-left: 9px;
    }
    svg {
      display: none;
      margin-right: 0;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: column;
    margin-left: 32px;
    button {
      width: 162px;
      max-width: 162px;
      margin-left: 0;
      &:nth-of-type(2n) {
        margin-top: 12px;
        margin-left: 0;
      }

      svg {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    button {
      width: 162px;
      max-width: 162px;
      margin-left: 0;
      &:nth-of-type(2n) {
        margin-top: 0;
        margin-left: 16px;
      }

      svg {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
  }
  &.specialBtn {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 16px;
    margin-left: 0;
  }
  &.isInModal {
    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: column;
      margin-left: 32px;
      button {
        width: 120px;
        max-width: 120px;
        margin-left: 0;
        &:nth-of-type(2n) {
          margin-top: 16px;
          margin-left: 0;
        }

        svg {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
`;

export const TaskContentWrapper = styled.div`
  padding: 20px 16px 34px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
`;

export const RecordListWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-top: ${(props) => (props.isMore ? '16px' : '12px')};
  color: ${(props) => props.theme.colors.text60};
  cursor: pointer;
  padding: 6px 0 0;

  svg {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    color: ${(props) => props.theme.colors.icon};
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
    padding: 6px 0;
    font-weight: 700;
    font-size: 14px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: ${(props) => (props.isMore ? '24px' : '12px')};
  }
`;

export const NoCurrencyText = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  min-width: 100px;
  color: ${(props) => props.theme.colors.complementary};

  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`;
